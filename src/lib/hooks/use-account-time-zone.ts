import { useMe } from "./use-auth";

export const useAccountTimeZone = (): string | undefined => {
  const { data: account } = useMe();

  return account?.timezone || undefined;
};
