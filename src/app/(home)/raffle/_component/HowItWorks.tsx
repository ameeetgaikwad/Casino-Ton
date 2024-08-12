const HowItWorks = () => {
  const content = [
    {
      step: 1,
      title: "Buy a ticket",
      description: "Buy a ticket for the raffle draw you want to participate in. Each ticket costs $1.00",
    },
    {
      step: 2,
      title: "Wait for draw",
      description:
        "A draw occurs once the target number of tickets has been reached. For example, if 500 tickets are required, the draw will take place as soon as the last ticket is purchased. This process is not time-restricted.",
    },
    {
      step: 3,
      title: "Claim your prize",
      description: "If you win, you will be able to claim your prize from the raffle draw you participated in.",
    },
  ];

  return (
    <div className="mt-12 text-white">
      <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
      <p className="text-center text-sm mb-8">
        If the digits on your tickets match the winning numbers in the correct order, you win a portion of the prize
        pool. Simple!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.map((item, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6">
            <div className="bg-yellow-400 text-black font-bold rounded-full w-24 text-center py-1 mb-4">
              Step {item.step}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
