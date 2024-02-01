<template>
  <div class="flex size-full flex-col items-center justify-center px-6 py-8">
    <div v-if="isPending" class="flex size-full flex-col items-center justify-center">
      <Loader2 class="size-9 animate-spin text-slate-950" />
    </div>
    <div v-else class="size-full max-w-md">
      <div class="space-y-4 pb-8">
        <h1 class="pt-4 text-2xl font-bold">
          親愛的參與者，您好！
        </h1>
        <div class="text-sm text-gray-500">
          非常感謝你參與本次活動，讓這次活動能更加完善，當然我們也希望能繼續讓攜澎引盼越來越好。<br>
          <br>
          為了能繼續傳承活動精神，這裡邀請您花 2 分鐘填寫這份調查，我們都會認真閱讀您的建議，讓我們在未來能幫助到更多學弟妹。
        </div>
      </div>
      <form class="space-y-3" @submit="onSubmit">
        <SurveyQuestion v-for="question in questions" :key="question.id" :question="question" :name="question.name" />
        <div class="flex justify-center">
          <Button type="submit" class="mt-2 w-full" :disabled="isSending">
            <Loader2 v-if="isSending" class="mr-2 size-4 animate-spin" />
            {{ isSending ? "送出中" : "送出" }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "~/components/ui/toast";
import type { Question } from "@/types";

const liff = useLiff();
const isPending = ref(true);
const isSending = ref(false);
const { toast } = useToast();

if (liff.user?.type.speaker || liff.user?.type.staff) {
  onMounted(async () => {
    toast({
      title: "請填寫其他問卷",
      description: "這份問卷僅供一般會眾填寫"
    });
    await navigateTo("/");
  });
} else {
  await checkUserFilled();
}

async function checkUserFilled () {
  const { pending } = await useFetch("/api/user/survey/filled", {
    headers: {
      authorization: `${liff.getIdToken()}`
    },
    lazy: true,
    onResponseError: async ({ response }) => {
      if (response.status === 401) {
        await navigateTo("/login");
        return;
      }

      toast({
        title: "發生錯誤",
        description: "請稍後再試"
      });
      console.error(response);
      await navigateTo("/");
    },
    onResponse: async ({ response }) => {
      if (response._data.filled) {
        toast({
          title: "您已填寫過問卷",
          description: "感謝您的參與"
        });
        await navigateTo("/");
      }
    }
  });

  watch(pending, (value) => {
    isPending.value = value;
  });
}

const formSchema = toTypedSchema(z.object({
  identity: z.string().min(1),
  grade: z.string().min(1),
  group: z.string().min(1),
  source: z.string().min(1),
  reason: z.string().min(1),
  satisfactionRating: z.string().min(1).max(1),
  achievementRating: z.string().min(1).max(1),
  morningRating: z.string().min(1).max(1),
  speakerRating: z.string().min(1).max(1),
  boothRating: z.string().min(1).max(1),
  lotteryRating: z.string().min(1).max(1),
  recommendRating: z.string().min(1).max(1),
  interviewCount: z.string().min(1).max(12),
  suggestion: z.string().min(0).max(150)
}));

const DEFAULTRATING_OPTIONS = [
  { label: "非常有幫助", value: "5" },
  { label: "有幫助", value: "4" },
  { label: "普通", value: "3" },
  { label: "沒有幫助", value: "2" },
  { label: "非常沒有幫助", value: "1" }
];

const questions: Question[] = [
  {
    id: "1",
    name: "identity",
    type: "select",
    question: "你的身份是？",
    required: true,
    options: [
      { label: "高中生", value: "student" },
      { label: "家長", value: "parent" },
      { label: "教師", value: "teacher" },
      { label: "其他", value: "other" }
    ]
  }, {
    id: "2",
    name: "grade",
    type: "select",
    question: "你的年級是？",
    required: true,
    options: [
      { label: "一年級", value: "1" },
      { label: "二年級", value: "2" },
      { label: "三年級", value: "3" },
      { label: "我不是學生", value: "0" }
    ]
  },
  {
    id: "3",
    name: "group",
    type: "select",
    question: "你的班群是？",
    required: true,
    options: [
      { label: "一類組", value: "1" },
      { label: "二類組", value: "2" },
      { label: "三類組", value: "3" },
      { label: "我還沒分組 / 我不是學生", value: "0" }
    ]
  },
  {
    id: "4",
    name: "source",
    type: "select",
    question: "你如何得知此活動？",
    required: true,
    options: [
      { label: "學校老師介紹", value: "school" },
      { label: "同學介紹", value: "classmate" },
      { label: "學長姐到班分享", value: "friend" },
      { label: "Facebook", value: "facebook" },
      { label: "Instagram", value: "instagram" },
      { label: "其他", value: "other" }
    ]
  },
  {
    id: "5",
    name: "reason",
    type: "select",
    question: "為何想來本次活動？",
    required: true,
    options: [
      { label: "認識大學科系", value: "major" },
      { label: "瞭解升學制度", value: "apply-rule" },
      { label: "為學習歷程或備審製作做準備", value: "portfolio" },
      { label: "其他", value: "other" }
    ]
  },
  {
    id: "6",
    name: "satisfactionRating",
    type: "select",
    question: "你對於本次活動的滿意度？",
    required: true,
    options: [
      { label: "非常滿意", value: "5" },
      { label: "滿意", value: "4" },
      { label: "普通", value: "3" },
      { label: "不滿意", value: "2" },
      { label: "非常不滿意", value: "1" }
    ]
  },
  {
    id: "7",
    name: "achievementRating",
    type: "select",
    question: "您是否有達成參加本次活動的目標？",
    required: true,
    options: [
      { label: "全部達成", value: "5" },
      { label: "部分達成", value: "4" },
      { label: "普通", value: "3" },
      { label: "部分未達成", value: "2" },
      { label: "沒有達成", value: "1" }
    ]
  },
  {
    id: "8",
    name: "morningRating",
    type: "select",
    question: "上午場簡報提供你的升學制度資訊，是否對你有幫助？",
    required: true,
    options: DEFAULTRATING_OPTIONS
  },
  {
    id: "9",
    name: "speakerRating",
    type: "select",
    question: "下午場中，大學學長姐的校系介紹是否對你有幫助？",
    required: true,
    options: DEFAULTRATING_OPTIONS
  },
  {
    id: "10",
    name: "boothRating",
    type: "select",
    question: "下午場中，大專院校攤位提供的資訊是否對你有幫助？",
    required: true,
    options: DEFAULTRATING_OPTIONS
  },
  {
    id: "11",
    type: "select",
    name: "lotteryRating",
    question: "下午場的抽獎活動，是否幫助你參與到更多攤位與訪談？",
    required: true,
    options: DEFAULTRATING_OPTIONS
  },
  {
    id: "12",
    name: "recommendRating",
    type: "select",
    question: "您向同學推薦明年攜澎引盼的可能性有多大？",
    required: true,
    options: [
      { label: "非常有可能", value: "5" },
      { label: "有可能", value: "4" },
      { label: "普通", value: "3" },
      { label: "不太有可能", value: "2" },
      { label: "非常不可能", value: "1" }
    ]
  },
  {
    id: "13",
    name: "interviewCount",
    type: "select",
    question: "你在下午博覽會裡訪談的學長姐人數？",
    required: true,
    options: [
      { label: "0 ~ 3 人", value: "0~3" },
      { label: "4 ~ 6 人", value: "4~6" },
      { label: "7 人以上", value: "7 and more" }
    ]
  },
  {
    id: "14",
    name: "suggestion",
    type: "long-text",
    question: "你對於此活動有任何建議嗎？",
    required: false
  }
];

const { handleSubmit } = useForm({
  validationSchema: formSchema
});

const onSubmit = handleSubmit(async (values) => {
  isSending.value = true;
  const data = await $fetch("/api/survey", {
    method: "POST",
    headers: {
      authorization: `${liff.getIdToken()}`
    },
    body: values
  });

  isSending.value = false;

  if (data.status !== "ok") {
    console.error(data);
    toast({
      title: "發生錯誤",
      description: "請稍後再試"
    });
    return;
  }

  toast({
    title: "回饋表單已送出",
    description: "謝謝您今年的參與和填寫！"
  });
  await navigateTo("/", {
    replace: true
  });
});
</script>
