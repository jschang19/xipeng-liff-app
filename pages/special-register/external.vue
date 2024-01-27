<template>
  <div class="flex size-full flex-col items-center justify-center px-6 py-12">
    <div class="size-full max-w-md space-y-3">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">
          協辦單位 / 校外夥伴
        </h1>
        <div class="text-sm text-gray-500">
          感謝貴單位協辦敝校的攜澎引盼 2024 活動，為了能綁定您的 LINE 帳號到所屬單位，請填寫以下資料。<span class="text-sm font-bold">一旦設定單位將無法更改，請務必確認資料正確性。</span>
        </div>
      </div>
      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <FormField
          v-slot="{ componentField }"
          name="boothId"
        >
          <FormItem>
            <FormLabel>您的單位</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇您的單位" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="b in booths" :key="b.id" :value="b.id">
                    {{ b.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="token"
        >
          <FormItem>
            <FormLabel>貴單位的驗證碼</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              貴單位的驗證碼在 Email 信件中
            </FormDescription>
          </FormItem>
        </FormField>
        <Button type="submit" class="mt-4" :disabled="isDisabled">
          送出
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

useHead({
  title: "個人資料"
});

interface Booth {
  id: string;
  name: string;
}
const liff = useLiff();
const booths = ref<Booth[]>([]);
const isDisabled = ref(false);
const formSchema = toTypedSchema(
  z.object({
    boothId: z.string(),
    token: z.string()
  })
);

const { toast } = useToast();

await useFetch("/api/booth", {
  lazy: true,
  headers: {
    authorization: `${liff.getIdToken()}`
  },
  onRequest: () => {
    isDisabled.value = true;
  },
  onRequestError: () => {
    isDisabled.value = false;

    toast({
      title: "載入失敗",
      description: "請稍後再試"
    });
  },
  onResponse: ({ response }) => {
    if (response.status === 200) {
      booths.value = response._data.booths;
      isDisabled.value = false;
    }
  }
});

if (liff.user?.type.speaker) {
  await navigateTo("/profile", { replace: true });
} else if (liff.user?.type.staff) {
  await navigateTo("/", { replace: true });
}

const form = useForm({
  validationSchema: formSchema
});

const onSubmit = form.handleSubmit(async (values) => {
  await useFetch("/api/booth/staff", {
    method: "POST",
    headers: {
      authorization: `${liff.getIdToken()}`,
      contentType: "application/json"
    },
    body: JSON.stringify(values),
    onRequest: () => {
      isDisabled.value = true;
    },
    onResponseError: ({ response }) => {
      isDisabled.value = false;

      if (response?.status === 404) {
        toast({
          title: "綁定失敗",
          description: "請檢查您的驗證碼是否正確"
        });
        return;
      }

      toast({
        title: "更新失敗",
        description: "請稍後再試"
      });
    },
    onResponse: async ({ response }) => {
      if (response.status === 200) {
        refreshNuxtData("user");
        toast({
          title: "更新成功",
          description: "您已經成功綁定單位"
        });

        await navigateTo("/", { replace: true });
      }
    }
  });
});
</script>
