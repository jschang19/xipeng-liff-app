<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogOverlay,
  DialogPortal,
  useEmitAsProps,
} from 'radix-vue'
import { cva } from 'class-variance-authority'
import { Cross2Icon } from '@radix-icons/vue'
import { cn } from '@/utils'

interface SheetContentProps extends DialogContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom'
  class?: string
  hideCloseBtn?: boolean | null
}

const props = defineProps<SheetContentProps>()

const emits = defineEmits<DialogContentEmits>()

const emitsAsProps = useEmitAsProps(emits)

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-border data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t border-border data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4  border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      :class="cn(sheetVariants({ side: props.side }), props.class)"
      v-bind="{ ...props, ...emitsAsProps }"
    >
      <slot />

      <DialogClose
        v-show="props.hideCloseBtn !== true"
        class="absolute top-4 right-4 p-0.5 transition-colors rounded-md hover:bg-secondary"
      >
        <Cross2Icon class="w-4 h-4 text-muted-foreground" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
