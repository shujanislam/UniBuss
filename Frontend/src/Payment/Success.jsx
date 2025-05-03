function Success() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Ticket graphic background */}
        <div className="absolute inset-0 bg-white opacity-20 rounded-lg -z-10"></div>

        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <div className="w-full bg-white py-6 px-8 rounded-lg shadow-md border-4 border-yellow-300 relative">
            {/* Ticket design border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-b-lg"></div>

            <p className="text-center text-xl text-gray-800 mb-6">Your payment was successfully processed. Thank you for your purchase!</p>

            <div className="bg-blue-600 text-white px-6 py-2 rounded-full w-full text-center font-semibold">
              Back to Home
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
