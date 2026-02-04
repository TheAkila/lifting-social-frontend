export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-28 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-black">
          Refund Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            Thank you for shopping at <strong>Lifting Social</strong>. We value your satisfaction and strive to provide you with the best online
            shopping experience possible. If, for any reason, you are not completely satisfied
            with your purchase, we are here to help.
          </p>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Returns</h2>
          <p className="text-gray-700 mb-6">
            We accept returns within <strong>14 days</strong> from the date of purchase. To be eligible for a return, your item must be
            unused and in the same condition that you received it. It must also be in the
            original packaging.
          </p>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Refunds</h2>
          <p className="text-gray-700 mb-6">
            Once we receive your return and inspect the item, we will notify you of the
            status of your refund. If your return is approved, we will initiate a refund to your
            original method of payment. Please note that the refund amount will exclude any
            shipping charges incurred during the initial purchase.
          </p>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Exchanges</h2>
          <p className="text-gray-700 mb-6">
            If you would like to exchange your item for a different size, color, or style,
            please contact our customer support team within <strong>7 days</strong> of receiving your order. We will provide you with further instructions on
            how to proceed with the exchange.
          </p>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Non-Returnable Items</h2>
          <p className="text-gray-700 mb-4">
            Certain items are non-returnable and non-refundable. These include:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Gift cards</li>
            <li>Downloadable digital content (training programs, guides)</li>
            <li>Personalized or custom-made items (custom apparel with names/numbers)</li>
            <li>Nutritional supplements (once opened for hygiene reasons)</li>
            <li>Used weightlifting equipment or accessories</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Damaged or Defective Items</h2>
          <p className="text-gray-700 mb-6">
            In the unfortunate event that your item arrives damaged or defective, please
            contact us immediately within <strong>48 hours of delivery</strong>. We will arrange for a replacement or issue a refund,
            depending on your preference and product availability. Please provide photos of the damaged item to expedite the process.
          </p>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Return Shipping</h2>
          <p className="text-gray-700 mb-6">
            You will be responsible for paying the shipping costs for returning your item
            unless the return is due to our error (e.g., wrong item shipped, defective
            product). In such cases, we will provide you with a prepaid shipping label or arrange for pickup at no cost to you.
          </p>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Processing Time</h2>
          <p className="text-gray-700 mb-6">
            Refunds and exchanges will be processed within <strong>7-10 business days</strong> after we receive your returned item. Please note that it may take
            additional 3-5 business days for the refund to appear in your account, depending on your
            payment provider or bank.
          </p>

          <h2 className="text-2xl font-bold text-black mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-6">
            If you have any questions or concerns regarding our refund policy, please
            contact our customer support team at:
          </p>
          <ul className="list-none text-gray-700 mb-8 space-y-2">
            <li><strong>Email:</strong> support@liftingsocial.lk</li>
            <li><strong>Phone:</strong> +94 77 123 4567</li>
            <li><strong>Address:</strong> Lifting Social, Colombo, Sri Lanka</li>
          </ul>
          <p className="text-gray-700 mb-6">
            We are here to assist you and ensure your shopping
            experience with us is enjoyable and hassle-free.
          </p>

          <p className="text-sm text-gray-500 italic mt-8 pt-6 border-t border-gray-200">
            Last updated: February 4, 2026
          </p>
        </div>
      </div>
    </div>
  )
}
