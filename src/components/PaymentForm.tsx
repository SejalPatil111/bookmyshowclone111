import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "credit-card" | "debit-card" | "upi";

interface PaymentFormProps {
  totalAmount: number;
  isProcessing: boolean;
  onSubmit: (method: PaymentMethod) => void;
  onBack: () => void;
}

interface CardFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface UpiFormData {
  upiId: string;
}

const PaymentForm = ({ totalAmount, isProcessing, onSubmit, onBack }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card");
  const [cardData, setCardData] = useState<CardFormData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiData, setUpiData] = useState<UpiFormData>({
    upiId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validateCardForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (cardData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Enter a valid 16-digit card number";
    }
    if (cardData.cardName.trim().length < 2) {
      newErrors.cardName = "Enter the name on card";
    }
    if (cardData.expiryDate.length < 5) {
      newErrors.expiryDate = "Enter valid expiry date (MM/YY)";
    }
    if (cardData.cvv.length < 3) {
      newErrors.cvv = "Enter valid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpiForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!upiData.upiId.includes("@")) {
      newErrors.upiId = "Enter a valid UPI ID (e.g., name@upi)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    let isValid = false;

    if (paymentMethod === "upi") {
      isValid = validateUpiForm();
    } else {
      isValid = validateCardForm();
    }

    if (isValid) {
      onSubmit(paymentMethod);
    }
  };

  const paymentMethods = [
    {
      id: "credit-card" as PaymentMethod,
      label: "Credit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex",
    },
    {
      id: "debit-card" as PaymentMethod,
      label: "Debit Card",
      icon: CreditCard,
      description: "All major banks",
    },
    {
      id: "upi" as PaymentMethod,
      label: "UPI",
      icon: Smartphone,
      description: "Google Pay, PhonePe, Paytm",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Select Payment Method</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => {
            setPaymentMethod(value as PaymentMethod);
            setErrors({});
          }}
          className="grid gap-3"
        >
          {paymentMethods.map((method) => (
            <div key={method.id}>
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={method.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
                  "border-border bg-secondary/30 hover:bg-secondary/60",
                  "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  paymentMethod === method.id ? "bg-primary/20" : "bg-muted"
                )}>
                  <method.icon className={cn(
                    "w-6 h-6",
                    paymentMethod === method.id ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{method.label}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  paymentMethod === method.id 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground"
                )}>
                  {paymentMethod === method.id && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Card Payment Form */}
      {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
        <div className="space-y-4 bg-secondary/30 rounded-xl p-4 border border-border">
          <h4 className="font-medium text-foreground">
            {paymentMethod === "credit-card" ? "Credit Card" : "Debit Card"} Details
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.cardNumber}
              onChange={(e) =>
                setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })
              }
              maxLength={19}
              className="bg-background"
            />
            {errors.cardNumber && (
              <p className="text-destructive text-sm">{errors.cardNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardData.cardName}
              onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
              className="bg-background"
            />
            {errors.cardName && (
              <p className="text-destructive text-sm">{errors.cardName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChange={(e) =>
                  setCardData({ ...cardData, expiryDate: formatExpiryDate(e.target.value) })
                }
                maxLength={5}
                className="bg-background"
              />
              {errors.expiryDate && (
                <p className="text-destructive text-sm">{errors.expiryDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                placeholder="•••"
                value={cardData.cvv}
                onChange={(e) =>
                  setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "") })
                }
                maxLength={4}
                className="bg-background"
              />
              {errors.cvv && (
                <p className="text-destructive text-sm">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPI Payment Form */}
      {paymentMethod === "upi" && (
        <div className="space-y-4 bg-secondary/30 rounded-xl p-4 border border-border">
          <h4 className="font-medium text-foreground">UPI Details</h4>
          
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="yourname@upi"
              value={upiData.upiId}
              onChange={(e) => setUpiData({ ...upiData, upiId: e.target.value })}
              className="bg-background"
            />
            {errors.upiId && (
              <p className="text-destructive text-sm">{errors.upiId}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            <span>A payment request will be sent to your UPI app</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-1"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay $${totalAmount.toFixed(2)}`
          )}
        </Button>
      </div>

      {/* Security Note */}
      <p className="text-center text-xs text-muted-foreground">
        🔒 Your payment information is secure and encrypted
      </p>
    </div>
  );
};

export default PaymentForm;
