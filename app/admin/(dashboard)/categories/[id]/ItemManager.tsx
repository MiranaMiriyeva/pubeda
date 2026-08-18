'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Plus, Sparkles } from 'lucide-react'
import {
  createItem,
  updateItem,
  deleteItem,
  toggleItemAvailability,
  reorderItems,
} from '../../actions/items'
import { ItemFormDialog, type ItemFormValues } from './ItemFormDialog'
import { cn, formatPrice } from '@/lib/utils'

export interface AdminItem {
  id: string
  title: string
  titleEn: string | null
  titleRu: string | null
  subtitle: string | null
  subtitleEn: string | null
  subtitleRu: string | null
  description: string | null
  descriptionEn: string | null
  descriptionRu: string | null
  price: number
  priceLabel: string | null
  isSet: boolean
  available: boolean
}

export function ItemManager({
  categoryId,
  initial,
}: {
  categoryId: string
  initial: AdminItem[]
}) {
  const [items, setItems] = useState<AdminItem[]>(initial)
  const [editing, setEditing] = useState<AdminItem | null>(null)
  const [creating, setCreating] = useState(false)
  const [, startTransition] = useTransition()
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next)
    startTransition(async () => {
      try {
        await reorderItems(categoryId, next.map((i) => i.id))
      } catch {
        setItems(items)
        toast.error('Could not save order')
      }
    })
  }

  async function handleSubmit(values: ItemFormValues) {
    try {
      if (editing) {
        const u = await updateItem(editing.id, values)
        setItems((prev) =>
          prev.map((i) =>
            i.id === editing.id
              ? {
                  ...i,
                  ...values,
                  price: Number(u.price),
                }
              : i,
          ),
        )
        toast.success('Saved')
      } else {
        const c = await createItem(categoryId, values)
        setItems((prev) => [
          ...prev,
          {
            id: c.id,
            title: c.title,
            titleEn: c.titleEn,
            titleRu: c.titleRu,
            subtitle: c.subtitle,
            subtitleEn: c.subtitleEn,
            subtitleRu: c.subtitleRu,
            description: c.description,
            descriptionEn: c.descriptionEn,
            descriptionRu: c.descriptionRu,
            price: Number(c.price),
            priceLabel: c.priceLabel,
            isSet: c.isSet,
            available: c.available,
          },
        ])
        toast.success('Created')
      }
      setEditing(null)
      setCreating(false)
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  async function handleDelete(item: AdminItem) {
    if (!confirm(`Delete "${item.title}"?`)) return
    try {
      await deleteItem(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      toast.success('Deleted')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  async function handleToggle(item: AdminItem) {
    const next = !item.available
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: next } : i)))
    try {
      await toggleItemAvailability(item.id, next)
    } catch {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, available: !next } : i)))
      toast.error('Could not update')
    }
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {items.map((it) => (
              <SortableItemRow
                key={it.id}
                item={it}
                onEdit={() => setEditing(it)}
                onDelete={() => handleDelete(it)}
                onToggle={() => handleToggle(it)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => setCreating(true)}
        className="mt-4 w-full h-11 rounded-lg border-2 border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary flex items-center justify-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add item
      </button>

      {(editing || creating) && (
        <ItemFormDialog
          initial={
            editing
              ? {
                  title: editing.title,
                  titleEn: editing.titleEn ?? '',
                  titleRu: editing.titleRu ?? '',
                  subtitle: editing.subtitle ?? '',
                  subtitleEn: editing.subtitleEn ?? '',
                  subtitleRu: editing.subtitleRu ?? '',
                  description: editing.description ?? '',
                  descriptionEn: editing.descriptionEn ?? '',
                  descriptionRu: editing.descriptionRu ?? '',
                  price: editing.price,
                  priceLabel: editing.priceLabel ?? '',
                  isSet: editing.isSet,
                  available: editing.available,
                }
              : {
                  title: '',
                  titleEn: '',
                  titleRu: '',
                  subtitle: '',
                  subtitleEn: '',
                  subtitleRu: '',
                  description: '',
                  descriptionEn: '',
                  descriptionRu: '',
                  price: 0,
                  priceLabel: '',
                  isSet: false,
                  available: true,
                }
          }
          isEdit={!!editing}
          onCancel={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSubmit={handleSubmit}
        />
      )}
    </>
  )
}

function SortableItemRow({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: AdminItem
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition } as const

  const price = item.priceLabel || formatPrice(item.price)

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 bg-card border border-border rounded-lg pl-1 pr-2 py-1.5',
        !item.available && 'opacity-60',
        isDragging && 'shadow-lg ring-2 ring-primary/40 z-10',
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-2 cursor-grab active:cursor-grabbing text-muted-foreground touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-center gap-2">
          {item.isSet && (
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider"
              title="Set menu"
            >
              <Sparkles className="w-2.5 h-2.5" />
              SET
            </span>
          )}
          <span className="font-medium text-sm truncate">{item.title}</span>
        </div>
        {item.subtitle && (
          <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
        )}
      </div>

      <div className="text-sm font-heading font-bold text-primary tabular-nums shrink-0">
        {price}
      </div>

      <button
        type="button"
        onClick={onToggle}
        role="switch"
        aria-checked={item.available}
        aria-label={item.available ? 'Mark unavailable' : 'Mark available'}
        title={item.available ? 'Available' : 'Unavailable'}
        className={cn(
          'ml-1 shrink-0 inline-flex items-center w-10 h-6 rounded-full p-0.5 transition-colors',
          item.available ? 'bg-primary justify-end' : 'bg-border justify-start',
        )}
      >
        <span className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" />
      </button>

      <button
        onClick={onEdit}
        aria-label="Edit"
        className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onDelete}
        aria-label="Delete"
        className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </li>
  )
}
