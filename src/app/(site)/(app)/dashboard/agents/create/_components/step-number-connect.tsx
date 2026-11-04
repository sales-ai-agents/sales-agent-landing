"use client";

import { Check } from "lucide-react";

import { SipSetupStep } from "../../_components/connect-number/sip-setup-step";
import { useSipConnect } from "../../_components/connect-number/use-sip-connect";

interface StepNumberConnectProps {
  onConnected: (numberId: number) => void;
}

export const StepNumberConnect = ({ onConnected }: StepNumberConnectProps) => {
  const sip = useSipConnect({ onVerified: onConnected });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Підключення АТС (SIP)</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Після цього дзвінки на ваш номер прийматиме агент
          </p>
        </div>
        {sip.isVerified && (
          <span className="text-success flex items-center gap-1 text-xs font-medium">
            <Check className="h-3.5 w-3.5" />
            Підключення успішне
          </span>
        )}
      </div>

      <SipSetupStep
        sipUri={sip.sipUri}
        sipHost={sip.sipHost}
        username={sip.username}
        password={sip.password}
        hasTrunk={sip.hasTrunk}
        phone={sip.phone}
        onPhoneChange={sip.setPhone}
        onProvision={sip.provision}
        isProvisioning={sip.isProvisioning}
        canProvision={sip.isPhoneValid}
        onVerify={sip.startVerify}
        isVerifying={sip.isPolling}
        verifyHint={sip.verifyHint}
      />
    </div>
  );
};
