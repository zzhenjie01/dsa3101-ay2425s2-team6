import "./environmentalCard.css";
import { useContext, useState } from "react";
import { ChatBotContext } from "../context/contexts";

// import { TrendingUp } from "lucide-react";
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function EnvironmentalCard(props) {
  // return <p>Environmental</p>;
  // console.log(props);
  return (
    <section className="py-24 ">
      <div className="mx-auto flex max-w-fit items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <h3>Environmental</h3>
      </div>
    </section>
  );
}
