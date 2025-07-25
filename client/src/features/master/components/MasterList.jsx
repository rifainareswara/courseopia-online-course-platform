import { useTitle } from "@/hooks/useTitle";
import { useGetMastersQuery } from "../api/masterApiSlice";
import MasterCard from "./MasterCard";
import MasterSkeletonCard from "@/components/Skeleton/MasterSkeletonCard";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";

export default function MasterList() {
  useTitle("Masters | Courseopia");

  const { isAdmin } = useAuth();
  const {
    data: masters,
    isLoading,
    isError,
  } = useGetMastersQuery("mastersList", {
    pollingInterval: 300000, // 5 minuti
  });

  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [masterCategories, setMasterCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMasters, setFilteredMasters] = useState([]);

  useEffect(() => {
    const filterMasters = () => {
      let filtered = masters;
      if (selectedCategory !== "Tutti") {
        filtered = filtered.filter(
          (master) => master.category.title === selectedCategory
        );
      }
      if (searchTerm) {
        filtered = filtered.filter((master) =>
          master.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredMasters(filtered);
    };
    if (masters) {
      filterMasters();
    }
  }, [masters, selectedCategory, searchTerm]);

  useEffect(() => {
    if (masters) {
      const uniqueCategories = [
        ...new Set(masters.map((master) => master.category.title)),
      ];
      setMasterCategories(uniqueCategories);
    }
  }, [masters]);

  return (
    <>
      <div>
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl font-bold mb-12">Masters</h2>
          {isAdmin && (
            <Link
              to="/dash/crea-master"
              className="bg-primary rounded-full p-2 w-10 h-10 items-center hover:scale-110 hover:cursor-pointer"
            >
              <Plus className="w-full h-full text-white" />
            </Link>
          )}
        </div>
        <div className="text-center md:w-1/2 lg:w-2/3 mx-auto mb-10">
          <h1 className="text-2xl font-bold mb-5">Pilih gelar master</h1>
          <p className="text-lg font-light">
            Hanya Anda yang tahu jalur mana yang terbaik untuk Anda. Pilihlah
            jalur yang paling sesuai dengan minat dan hasrat Anda. Anda dapat
            mengubahnya kapan saja, sesering yang Anda mau.
          </p>
        </div>
        <div className="flex gap-2 mb-8 justify-center items-center overflow-x-auto py-2">
          <Button
            variant={`${selectedCategory === "Tutti" ? "outline" : "default"}`}
            onClick={() => setSelectedCategory("Tutti")}
          >
            Tutti
          </Button>
          {masterCategories?.map((category) => (
            <Button
              key={category}
              variant={`${
                selectedCategory === category ? "outline" : "default"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div>
          <FormInput
            label="Cari gelar master"
            type="text"
            value={searchTerm}
            placeholder="Cari gelar master"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          {isLoading ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <MasterSkeletonCard key={index} />
                ))}
            </div>
          ) : filteredMasters?.length > 0 ? (
            filteredMasters.map((master) => (
              <MasterCard key={master._id} master={master} />
            ))
          ) : (
            <p>Tidak ada gelar master yang cocok dengan pencarian Anda.</p>
          )}
          {isError && <div>Terjadi kesalahan saat memuat master.</div>}
        </div>
      </div>
    </>
  );
}
