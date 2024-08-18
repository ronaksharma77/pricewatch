"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';

interface Props {
  priceHistory: string;
}

const ChartModal = ({ priceHistory }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      label: 'Price',
      data: [],
      fill: false,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(75,192,192,1)',
    }],
  });

  useEffect(() => {
    setIsOpen(false);

    // Parse the priceHistory string into an array of objects
    const parsedPriceHistory = JSON.parse(priceHistory);

    // Sort by date in ascending order
    const sortedPriceHistory = parsedPriceHistory.sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Prepare data for the chart
    const labels = sortedPriceHistory.map((entry: { date: string | number | Date; }) => new Date(entry.date).toLocaleDateString());
    const dataPoints = sortedPriceHistory.map((entry: { price: any; }) => entry.price);

    setData({
      labels: labels,
      datasets: [{
        label: 'Price',
        data: dataPoints,
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      }],
    });
  }, [priceHistory]); 

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
  };

  return (
    <>
      <button type="button" className="btn" onClick={() => setIsOpen(true)}>
        History
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-30" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <h4 className="text-lg font-semibold">Price History</h4>
                    <Image
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    />
                  </div>

                  <div className="w-full h-96 mt-4">
                    <Line data={data} options={options} />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ChartModal;
