"use client";

import React, { useEffect, useState } from "react";

export default function DashboardFrame() {
  const [data, setData] = useState();

  const getData = async () => {
    fetch("/api/layout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Frames</h1>
        <div>
          {data?.map((item) => {
            return (
              <div key={item.id} className="flex flex-row justify-between p-2 bg-amber-200 rounded mb-1">
                <div>
                  <span>{item.id}</span>
                </div>
                <div>
                  <span>{item.name}</span>
                </div>
                <div className="cursor-pointer hover:underline">Action</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
