"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Mail, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setClients([
      { id: 1, name: "Daniel leo", email: "daniel.leo@energyvest", portfolioValue: 12800, growth: "+14.5%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
      { id: 2, name: "William Johnson", email:"johnson@energyvest", portfolioValue: 9500, growth: "+8.2%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: 3, name: "Thomas", email: "thomas@energyvest", portfolioValue: 21200, growth: "+19.7%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
      { id: 4, name: "Blessing Etim", email: "blessing.etim@energyvest", portfolioValue: 17450, growth: "+12.1%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/46.jpg" },
      { id: 5, name: "Richard Ade", email: "Richard.ade@energyvest", portfolioValue: 10100, growth: "+9.3%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/men/33.jpg" },
      { id: 6, name: "Angela", email: "Angela.p@energyvest", portfolioValue: 15800, growth: "+13.2%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/21.jpg" },
      { id: 7, name: "Kingsley mah", email: "kingsley.@energyvest", portfolioValue: 23600, growth: "+22.1%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/24.jpg" },
      { id: 8, name: "Funke Balogun", email: "funke.balogun@energyvest", portfolioValue: 8700, growth: "+7.4%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/20.jpg" },
      { id: 9, name: "Emmanuel Ojo", email: "emmanuel.ojo@energyvest", portfolioValue: 19100, growth: "+16.8%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
      { id: 10, name: "Laura N", email: "Laura@energyvest", portfolioValue: 22100, growth: "+20.3%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/women/50.jpg" },
      { id: 11, name: "Adekunle Ayo", email: "adekunle.ayo@energyvest", portfolioValue: 14200, growth: "+11.9%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/53.jpg" },
      { id: 12, name: "Michelle", email: "michelle.m@energyvest", portfolioValue: 11100, growth: "+10.1%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/56.jpg" },
      { id: 13, name: "Ibrahim Bello", email: "ibrahim.bello@energyvest", portfolioValue: 23300, growth: "+21.9%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/58.jpg" },
      { id: 14, name: "Ruth Akpai", email: "ruth.akpai@energyvest", portfolioValue: 13200, growth: "+12.0%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/57.jpg" },
      { id: 15, name: "Mark Ige", email: "mark.ige@energyvest", portfolioValue: 8900, growth: "+6.9%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/men/37.jpg" },
      { id: 16, name: "Esther Udo", email: "esther.udo@energyvest", portfolioValue: 20100, growth: "+17.6%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/women/37.jpg" },
      { id: 17, name: "Peter Umeh", email: "peter.umeh@energyvest", portfolioValue: 14700, growth: "+12.8%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/29.jpg" },
      { id: 18, name: "Sandra Obei", email: "sandra.obei@energyvest", portfolioValue: 9800, growth: "+8.3%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/28.jpg" },
      { id: 19, name: "Godwin Nwa", email: "godwin.nwa@energyvest", portfolioValue: 24500, growth: "+24.2%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: 20, name: "Miriam Oheu", email: "miriam.okafor@energyvest", portfolioValue: 11000, growth: "+10.4%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
      { id: 21, name: "Daniel", email: "Daniel@energyvest", portfolioValue: 13400, growth: "+12.3%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/23.jpg" },
      { id: 22, name: "Janet Musli", email: "janet.musa@energyvest", portfolioValue: 10300, growth: "+9.1%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
      { id: 23, name: "Samuel Adigun", email: "samuel.adigun@energyvest", portfolioValue: 19800, growth: "+18.4%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
      { id: 24, name: "Bola Ogun", email: "bola.ogun@energyvest", portfolioValue: 15600, growth: "+13.0%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
      { id: 25, name: "Kelvin ilon", email: "kelvin.ilon@energyvest", portfolioValue: 12500, growth: "+11.0%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
      { id: 26, name: "Lilian Ekpo", email: "lilian.ekp@energyvest", portfolioValue: 17200, growth: "+14.7%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/10.jpg" },
      { id: 27, name: "Victor Udo", email: "victor.udo@energyvest", portfolioValue: 18800, growth: "+15.9%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/11.jpg" },
      { id: 28, name: "Joy Nnaji", email: "joy.nnaji@energyvest", portfolioValue: 9700, growth: "+8.1%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/11.jpg" },
      { id: 29, name: "William Onu", email: "William.onu@energyvest", portfolioValue: 20600, growth: "+19.2%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/15.jpg" },
      { id: 30, name: "Rebecca Ndukwe", email: "Rebecca.ndukwe@energyvest", portfolioValue: 11500, growth: "+10.8%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/15.jpg" },
      { id: 31, name: "Robert Obi", email: "Robert.obi@energyvest", portfolioValue: 17400, growth: "+14.4%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/17.jpg" },
      { id: 32, name: "Faith Chika", email: "faith.chika@energyvest", portfolioValue: 8600, growth: "+7.0%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/17.jpg" },
      { id: 33, name: "Olu Ilesanmi", email: "olu.ilesanmi@energyvest", portfolioValue: 21900, growth: "+20.0%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/18.jpg" },
      { id: 34, name: "Gloria Abah", email: "gloria.abah@energyvest", portfolioValue: 15300, growth: "+12.9%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/18.jpg" },
      { id: 35, name: "Michael Nnadozie", email: "michael.nnadozie@energyvest", portfolioValue: 14000, growth: "+11.5%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/19.jpg" },
      { id: 36, name: "Angela O", email: "angela.o@energyvest", portfolioValue: 9200, growth: "+8.0%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/19.jpg" },
      { id: 37, name: "Tunde Afolabi", email: "tunde.afolabi@energyvest", portfolioValue: 19900, growth: "+18.0%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
      { id: 38, name: "Aisha Abdullahi", email: "aisha.abdullahi@energyvest", portfolioValue: 11200, growth: "+9.5%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
      { id: 39, name: "Andrew E", email: "Andrew@energyvest", portfolioValue: 18100, growth: "+16.3%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/30.jpg" },
      { id: 40, name: "Victoria Adenuga", email: "victoria.adenuga@energyvest", portfolioValue: 9700, growth: "+8.1%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/30.jpg" },
      { id: 41, name: "Henry Ouon", email: "henry.ouon@energyvest", portfolioValue: 22600, growth: "+21.4%", riskLevel: "High", avatar: "https://randomuser.me/api/portraits/men/31.jpg" },
      { id: 42, name: "Agertha Umeh", email: "Agertha.umeh@energyvest", portfolioValue: 16800, growth: "+14.1%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/women/31.jpg" },
      { id: 43, name: "Segun Adeyemi", email: "segun.adeyemi@energyvest", portfolioValue: 13000, growth: "+11.2%", riskLevel: "Moderate", avatar: "https://randomuser.me/api/portraits/men/34.jpg" },
      { id: 44, name: "Susan I", email: "Susan.i@energyvest", portfolioValue: 10800, growth: "+9.7%", riskLevel: "Low", avatar: "https://randomuser.me/api/portraits/women/34.jpg" },
    ]);
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Client Directory</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-gray-700 focus:ring focus:ring-blue-200 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {client.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">{client.email}</p>

                <div className="w-full mt-5 border-t pt-4 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <DollarSign className="text-green-500" size={18} />
                    <span>
                      <strong>Portfolio:</strong> ${client.portfolioValue}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-2">
                    <TrendingUp className="text-blue-500" size={18} />
                    <span>
                      <strong>Growth:</strong>{" "}
                      <span
                        className={`font-medium ${
                          client.growth.includes("+")
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {client.growth}
                      </span>
                    </span>
                  </div>

                  <div className="mt-3 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    Risk Level: {client.riskLevel}
                  </div>
                </div>

                <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-xl flex items-center gap-2">
                  <Mail size={14} /> Contact
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>No clients found matching your search.</p>
        </div>
      )}
      <p className="pl-5 text-center pt-4 pb-3 animate-bounce">loading more clients....</p>
      <Footer />
    </div>
  );
}
