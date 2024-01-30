import type { Select } from '../ui/select';
<template>
  <div class="flex max-w-lg flex-col gap-3 py-3 text-base">
    <FormField v-slot="{ componentField }" :name="props.question.name">
      <FormItem>
        <FormLabel>{{ props.question.question }}</FormLabel>
        <Select v-if="props.question.type === 'select'" v-bind="componentField" :placeholder="props.question.placeholder">
          <SelectTrigger>
            <SelectValue :placeholder="props.question.placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in props.question.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Textarea v-if="props.question.type === 'long-text'" v-bind="componentField" />
      </FormItem>
    </FormField>
  </div>
</template>
<script setup lang="ts">
import type { Question } from "@/types";

const props = defineProps({
  question: {
    type: Object as PropType<Question>,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

</script>
