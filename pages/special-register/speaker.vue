<template>
  <div class="flex size-full flex-col items-center justify-center px-6 py-12">
    <div class="size-full max-w-md space-y-3">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold">
          完成講者資料
        </h1>
        <div class="text-sm text-gray-500">
          系統會同時透過部分資料比對表單回覆，來綁定 LINE 帳號與講者資料，所以請確保你填的個人資訊與報名時相同。
        </div>
      </div>
      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <FormField
          v-slot="{ componentField }"
          name="name"
        >
          <FormItem>
            <FormLabel>全名</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormDescription>這也會顯示在議程介紹上</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="email"
        >
          <FormItem>
            <FormLabel>報名用的 Gmail</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="phone"
        >
          <FormItem>
            <FormLabel>報名填的電話號碼</FormLabel>
            <FormControl>
              <Input type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="eventId"
        >
          <FormItem>
            <FormLabel>場次</FormLabel>

            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="event in events" :key="event.id" :value="event.id">
                    {{ event.title }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>
              上午場講者請選擇早上負責的場次即可
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="bio"
        >
          <FormItem>
            <FormLabel>個人介紹</FormLabel>
            <FormControl>
              <Textarea type="text" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" class="mt-4">
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

interface Event {
  title: string;
  id: string;
}

const liff = useLiff();
const isSpeaker = ref(liff.user?.type.speaker);
const events: Ref<Event[]> = ref([]);
const isDisabled = ref(false);
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1).max(10),
    phone: z.string().min(10).max(10),
    email: z.string().email(),
    eventId: z.string(),
    bio: z.string().min(2).max(150).optional()
  })
);

const { toast } = useToast();

await useFetch("/api/event", {
  lazy: true,
  headers: {
    authorization: `${liff.getIdToken()}`
  },
  onRequest: () => {
    isDisabled.value = true;
  },
  onRequestError: () => {
    toast({
      title: "載入失敗",
      description: "請稍後再試"
    });
  },
  onResponse: ({ response }) => {
    if (response.status === 200) {
      events.value = response._data.events;
      isDisabled.value = false;
    }
  }
});

if (isSpeaker.value) {
  await navigateTo("/profile", { replace: true });
}

const form = useForm({
  validationSchema: formSchema
});

const onSubmit = form.handleSubmit(async (values) => {
  console.log(values);
  await useFetch("/api/speakers", {
    method: "POST",
    headers: {
      authorization: `${liff.getIdToken()}`,
      contentType: "application/json"
    },
    body: JSON.stringify(values),
    onRequest: () => {
      isDisabled.value = true;
    },
    onResponseError: () => {
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
          description: "您已經成功成為講者"
        });

        await navigateTo("/", { replace: true });
      }
    }
  });
});
</script>
