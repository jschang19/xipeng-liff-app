<template>
  <div class="h-full w-full py-8 flex flex-col justify-center items-center px-6">
    <div class="h-full max-w-md w-full space-y-3">
      <div class="py-4 text-2xl font-bold">
        個人資料
      </div>
      <div v-if="pending" class="flex flex-col items-center justify-center h-full">
        <Loader2 class="w-8 h-8 animate-spin" />
      </div>
      <FetchError v-else-if="ProfileError" />
      <form v-else-if="!pending && isSpeaker" class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name" :model-value="prefillData.name">
          <FormItem>
            <FormLabel>全名</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              這會顯示在講者介紹上
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
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
          儲存變更
        </Button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useForm } from "vee-validate";
import { useToast } from "~/components/ui/toast";

useHead({
  title: "個人資料"
});

const liff = useLiff();
const isSpeaker = ref(liff.user?.type.speaker);
const formSchema = toTypedSchema(z.object({
  name: z.string().min(1).max(10),
  university: z.string().min(1).max(25),
  major: z.string().min(1).max(25),
  bio: z.string().min(2).max(150).optional()
}));
const prefillData = ref({
  name: "",
  university: "",
  major: "",
  bio: ""
});

const { toast } = useToast();

if (!isSpeaker.value) {
  await navigateTo("/", { replace: true });
}

const { error: ProfileError, pending } = await useFetch(
  "/api/speakers/profile",
  {
    method: "GET",
    headers: {
      authorization: `${liff.getIdToken()}`
    },
    lazy: true,
    onResponseError: () => {
      toast({
        title: "取得資料失敗",
        description: "請稍後再試"
      });
    },
    onResponse: ({ response }) => {
      prefillData.value = {
        name: response._data.name,
        university: response._data.university,
        major: response._data.major,
        bio: response._data.bio
      };
    }
  }
);

const form = useForm({
  validationSchema: formSchema
});

const onSubmit = form.handleSubmit(async (values) => {
  await useFetch(
    "/api/speakers/profile",
    {
      method: "PUT",
      headers: {
        authorization: `${liff.getIdToken()}`,
        contentType: "application/json"
      },
      body: JSON.stringify(values),
      onResponseError: () => {
        toast({
          title: "更新失敗",
          description: "請稍後再試"
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
