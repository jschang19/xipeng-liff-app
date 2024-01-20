<template>
  <div v-if="liffStore.user" class="h-full w-full py-8 flex flex-col justify-center items-center px-6">
    <div class="h-full max-w-md w-full space-y-3">
      <div class="py-4 text-2xl font-bold">
        個人資料
      </div>
      <form v-if="isSpeaker" class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="university" :model-value="prefillData.university">
          <FormItem>
            <FormLabel>大學名稱</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              請填寫完整名稱，例如：國立臺灣大學
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="major" :model-value="prefillData.major">
          <FormItem>
            <FormLabel>科系名稱</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              請填寫完整名稱，例如：資訊工程學系
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="bio" :model-value="prefillData.bio">
          <FormItem>
            <FormLabel>個人介紹</FormLabel>
            <FormControl>
              <Textarea type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" class="mt-4">
          Submit
        </Button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";
import { useToast } from "~/components/ui/toast";
import { useLiffStore } from "~/stores/liff";

useHead({
  title: "個人資料"
});

const liffStore = useLiffStore();
const formSchema = toTypedSchema(z.object({
  university: z.string().min(1).max(25),
  major: z.string().min(1).max(25),
  bio: z.string().min(2).max(150).optional()
}));
const isSpeaker = ref(liffStore.user?.type.speaker);
const prefillData = ref({
  university: "",
  major: "",
  bio: ""
});

const { toast } = useToast();
const form = useForm({
  validationSchema: formSchema
});

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values);

  await useFetch(
    "/api/speakers/profile",
    {
      method: "PUT",
      headers: {
        authorization: `${liffStore.getIdToken()}`,
        contentType: "application/json"
      },
      body: JSON.stringify(values),
      onRequestError: ({ error }) => {
        toast({
          title: "更新失敗",
          description: error.message
        });
      },
      onResponse: ({ response }) => {
        if (response.status === 200) {
          toast({
            title: "更新成功",
            description: "你的講者資料已更新"
          });
        }
      }
    }
  );
});
</script>
