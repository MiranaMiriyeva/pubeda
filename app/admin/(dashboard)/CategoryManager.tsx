'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
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
import { GripVertical, Pencil, Trash2, Plus, ChevronRight } from 'lucide-react'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from './actions/categories'
import { CategoryDialog, type CategoryFormValues } from './CategoryDialog'
import { cn } from '@/lib/utils'

export interface AdminCategory {
  id: string
  slug: string
  name: string
  nameEn: string | null
  nameRu: string | null
  itemCount: number
}

export function CategoryManager({ initial }: { initial: AdminCategory[] }) {
  const [items, setItems] = useState<AdminCategory[]>(initial)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
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
        await reorderCategories(next.map((c) => c.id))
      } catch {
        setItems(items) // rollback
        toast.error('Could not save order')
      }
    })
  }

  async function handleSubmit(values: CategoryFormValues) {
    try {
      if (editing) {
        await updateCategory(editing.id, values)
        setItems((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? { ...c, name: values.name, nameEn: values.nameEn, nameRu: values.nameRu }
              : c,
          ),
        )
        toast.success('Saved')
      } else {
        const created = await createCategory(values)
        setItems((prev) => [
          ...prev,
          {
            id: created.id,
            slug: created.slug,
            name: created.name,
            nameEn: created.nameEn,
            nameRu: created.nameRu,
            itemCount: 0,
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

  async function handleDelete(cat: AdminCategory) {
    if (!confirm(`Delete "${cat.name}" and all its items?`)) return
    try {
      await deleteCategory(cat.id)
      setItems((prev) => prev.filter((c) => c.id !== cat.id))
      toast.success('Deleted')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {items.map((c) => (
              <SortableRow
                key={c.id}
                cat={c}
                onEdit={() => setEditing(c)}
                onDelete={() => handleDelete(c)}
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
        Add category
      </button>

      {(editing || creating) && (
        <CategoryDialog
          initial={
            editing
              ? {
                  name: editing.name,
                  nameEn: editing.nameEn ?? '',
                  nameRu: editing.nameRu ?? '',
                }
              : { name: '', nameEn: '', nameRu: '' }
          }
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

function SortableRow({
  cat,
  onEdit,
  onDelete,
}: {
  cat: AdminCategory
  onEdit: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as const

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 bg-card border border-border rounded-lg pl-1 pr-2 py-1.5',
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

      <Link href={`/admin/categories/${cat.id}`} className="flex-1 min-w-0 flex items-center gap-2 py-1.5">
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{cat.name}</div>
          <div className="text-xs text-muted-foreground">
            {cat.itemCount} {cat.itemCount === 1 ? 'item' : 'items'}
          </div>
        </div>
        <ChevronRight className="ml-auto w-4 h-4 text-muted-foreground shrink-0" />
      </Link>

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
