import { useLiff } from "#imports";
import { useToast } from "~/components/ui/toast/use-toast";

export default function () {
  const liff = useLiff();
  const isLoading = ref(false);
  const { toast } = useToast();

  async function handleStamp (participantId: string) {
    await useFetch("/api/user/stamp", {
      method: "POST",
      headers: {
        authorization: `${liff.getIdToken()}`
      },
      body: {
        participantId
      },
      onRequest: () => {
        isLoading.value = true;
      },
      onResponseError: ({ response }) => {
        isLoading.value = false;
        toast({
          title: "掃描失敗",
          description: response._data.displayMessage
        });
      },
      onResponse: () => {
        isLoading.value = false;
        toast({
          title: "掃描成功",
          description: "請參與者到集章冊頁面確認"
        });
      }
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

    const parsed = computed(() => {
      const params = new URLSearchParams(result);

      return {
        type: params.get("type"),
        data: params.get("data")
      };
    });

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

  return {
    isLoading,
    handleScanCode
  };
}
