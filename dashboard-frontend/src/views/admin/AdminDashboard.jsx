import React from "react";
import { MdCurrencyExchange, MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const state = {
    series: [
      { name: "Orders", data: [10, 20, 30, 40, 50, 60, 70] },
      { name: "Revenue", data: [20, 30, 40, 50, 60, 70, 80] },
      { name: "Sellers", data: [10, 20, 30, 40, 50, 60, 70] },
    ],
    options: {
      color: ["#181ee8", "181ee8"],
      plotOptions: { radius: 30 },
      chart: { background: "transparent", foreColor: "#d0d2d6" },
      dataLabels: { enabled: false },
      strock: {
        show: true,
        curve: ["smooth", "straight", "stepline"],
        lineCap: "butt",
        colors: "#f0f0f0",
        width: 0.5,
        dashArray: 0,
      },
      xaxis: {
        categorys: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      legend: { position: "top" },
      responsive: [
        {
          breakpoint: 565,
          options: {
            plotOptions: { bar: { horizontal: true } },
            chart: { height: "550px" },
          },
        },
      ],
    },
  };

  const stats = [
    {
      value: "$3434",
      label: "Total Sales",
      bgColor: "#fae8e8",
      iconBgColor: "#fa0305",
      icon: <MdCurrencyExchange className="text-[#fae8e8]" />,
    },
    {
      value: "50",
      label: "Products",
      bgColor: "#fde2ff",
      iconBgColor: "#760077",
      icon: <MdProductionQuantityLimits className="text-[#fae8e8]" />,
    },
    {
      value: "10",
      label: "Sellers",
      bgColor: "#e9feea",
      iconBgColor: "#038000",
      icon: <FaUsers className="text-[#fae8e8]" />,
    },
    {
      value: "54",
      label: "Orders",
      bgColor: "#ecebff",
      iconBgColor: "#0200f8",
      icon: <FaCartShopping className="text-[#fae8e8]" />,
    },
  ];

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-5 rounded-md gap-3"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div className="flex flex-col justify-start items-start text-[#5c5a5a]">
              <h2 className="text-3xl font-bold">{stat.value}</h2>
              <span className="text-md font-medium">{stat.label}</span>
            </div>
            <div
              className="w-[40px] h-[47px] rounded-full flex justify-center items-center text-xl"
              style={{ backgroundColor: stat.iconBgColor }}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-wrap mt-7">
        <div className="w-full lg:w-7/12 lg:pr-3">
          <div className="w-full bg-[#6a5fdf] p-4 rounded-sm">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              height={350}
            />
          </div>
        </div>
        <div className="w-full lg:w-5/12 lg:pl-4 mt-6 lg:mt-0">
          <div className="w-full bg-[#6a5fdf] p-4 rounded-md text-[#d0d2d6]">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3">
                Recent Seller Message
              </h2>
              <Link className="font-semibold text-sm text-[#d0d2d6]">
                View All
              </Link>
            </div>
            <div className="flex flex-col gap-2 pt-6 text-[#d0d2d6]">
              <ol className="relative border-1 border-slate-600 ml-4">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="mb-3 ml-6">
                    <div className="flex absolute -left-5 justify-center items-center w-10 h-10 p-[6px] bg-[#4c7fe2] rounded-full">
                      <img
                        className="w-full rounded-full h-full"
                        src="http://localhost:3000/images/admin.jpg"
                        alt=""
                      />
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-center mb-2">
                        <Link className="text-md font-normal">Admin</Link>
                        <time className="mb-1 text-sm font-normal">
                          2 day ago
                        </time>
                      </div>
                      <div className="p-2 text-xs font-normal bg-slate-700 rounded-lg border border-slate-800">
                        How Are you
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3">
            Recent Orders
          </h2>
          <Link className="font-semibold text-sm text-[#d0d2d6]">View All</Link>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#d0d2d6] uppercase border-b border-slate-700">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Active</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    #343434
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    $34
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    Pending
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    Pending
                  </td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
