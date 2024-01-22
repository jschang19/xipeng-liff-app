<template>
  <div class="h-full w-full py-8 flex flex-col justify-center items-center px-6">
    <div class="h-full max-w-md w-full flex flex-col">
      <div class="flex-1 flex flex-col items-center justify-center w-full">
        <Tabs v-if="hasScanAccess" default-value="qrcode" class="mx-auto">
          <TabsContent value="qrcode">
            <div class="flex-1 flex flex-col gap-1 items-center justify-center">
              <div class="text-2xl font-bold">
                你的 QR Code
              </div>
              <NuxtImg :src="qrCodeUrl" placeholder />
              <div class="text-gray-500">
                請出示此 QR Code 給工作人員掃描
              </div>
            </div>
          </TabsContent>
          <TabsContent value="scanner">
            <div class="h-60 w-60 flex flex-col items-center justify-center">
              <Button size="lg" :disabled="isLoading" @click="handleScanCode">
                <Camera class="w-5 h-5 mr-2" />
                Scan Code
              </Button>
            </div>
          </TabsContent>
          <div class="w-full justify-center items-center flex pt-4">
            <TabsList>
              <TabsTrigger value="qrcode">
                顯示條碼
              </TabsTrigger>
              <TabsTrigger value="scanner">
                掃描條碼
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        <div v-else>
          <div class="text-2xl font-bold">
            Your QR Code
          </div>
          <NuxtImg :src="qrCodeUrl" class="w-32 h-32" width="350" height="350" preload />
          <div class="text-gray-500">
            請出示此 QR Code 給工作人員掃描
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Camera } from "lucide-vue-next";
import { useToast } from "~/components/ui/toast/use-toast";
const { toast } = useToast();

useHead({
  title: "活動 QR Code"
});

const liff = useLiff();
const hasScanAccess = ref(liff.user!.type.staff);
const isLoading = ref(false);

const qrCodeUrl = computed(() => {
  return `https://chart.apis.google.com/chart?cht=qr&choe=UTF-8&chs=350x350&chl=${
    encodeURIComponent(`
      type=stamp&data=${liff.user!.userId}
    `)
  }`;
});

async function handleStamp (participantId: string) {
  const { error } = await useFetch("/api/booths/stamps", {
    method: "POST",
    headers: {
      authorization: `${liff.getIdToken()}`
    },
    body: {
      participantId
    }
  });

  if (error.value) {
    isLoading.value = false;
    toast({
      title: "掃描失敗",
      description: "請查看 console 錯誤訊息"
    });

    return;
  }

  toast({
    title: "掃描成功",
    description: "請參與者到集章冊頁面確認"
  });
}

async function handleScanCode () {
  const result = await liff.scanCode();

  if (!result) {
    toast({
      title: "掃描失敗",
      description: "請重新掃描"
    });

    return;
  }

  const parsed = computed(
    () => {
      const params = new URLSearchParams(result);

      return {
        type: params.get("type"),
        data: params.get("data")
      };
    }
  );

  if (!parsed.value.type || !parsed.value.data) {
    console.error("Invalid QR Code", parsed.value);
    toast({
      title: "掃描失敗",
      description: "請檢查 QR Code 是否正確"
    });

    return;
  }

  switch (parsed.value.type) {
    case "stamp":
      await handleStamp(parsed.value.data);
      break;
    default:
      toast({
        title: "掃描失敗",
        description: "請重新掃描"
      });
      break;
  }

  isLoading.value = false;
}

</script>
