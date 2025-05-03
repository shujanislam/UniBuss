import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";

function Payment() {
  const { state } = useLocation();
  const [transactionUuid, setTransactionUuid] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const amount = Number(state?.totalAmount) || 0;  // ensure it's a number
  const taxAmount = 10;
  const serviceCharge = 0;
  const deliveryCharge = 0;
  const totalAmount = amount + taxAmount + serviceCharge + deliveryCharge;

  const signedFieldNames = "total_amount,transaction_uuid,product_code";

  useEffect(() => {
    // ✅ validate amount
    if (isNaN(amount) || amount <= 0) {
      setError("Invalid amount. Please enter a valid transaction amount.");
      return;
    }

    const uuid = uuidv4();
    setTransactionUuid(uuid);

    const message = `total_amount=${totalAmount},transaction_uuid=${uuid},product_code=EPAYTEST`;
    const hash = CryptoJS.HmacSHA256(message, "8gBm/:&EnhH.1/q");
    const hashBase64 = CryptoJS.enc.Base64.stringify(hash);
    setSignature(hashBase64);
  }, [amount, totalAmount]);

  if (error) {
    return (
      <div className="text-red-600 font-semibold text-center mt-4">
        {error}
      </div>
    );
  }

  if (!transactionUuid || !signature) return <div className="text-center text-lg font-semibold">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Payment</h1>
        <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
          <input type="hidden" name="amount" value={amount} />
          <input type="hidden" name="tax_amount" value={taxAmount} />
          <input type="hidden" name="product_service_charge" value={serviceCharge} />
          <input type="hidden" name="product_delivery_charge" value={deliveryCharge} />
          <input type="hidden" name="total_amount" value={totalAmount} />
          <input type="hidden" name="transaction_uuid" value={transactionUuid} />
          <input type="hidden" name="product_code" value="EPAYTEST" />
          <input type="hidden" name="success_url" value="http://localhost:5173/success" />
          <input type="hidden" name="failure_url" value="http://localhost:5173/failure" />
          <input type="hidden" name="signed_field_names" value={signedFieldNames} />
          <input type="hidden" name="signature" value={signature} />
          <input
            type="submit"
            value="Pay with Esewa"
            className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-full text-lg transition duration-300"
          />
        </form>
      </div>
    </div>
  );
}

export default Payment;
