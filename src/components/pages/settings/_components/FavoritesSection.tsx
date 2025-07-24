// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Eye,
//   Trash2,
//   Search,
//   MapPin,
//   Building,
//   DollarSign,
// } from "lucide-react";
// import { toast } from "sonner";

// interface Job {
//   id: string;
//   title: string;
//   employer_name: string;
//   city: string;
//   state: string;
//   description: string;
//   salary_min?: number;
//   salary_max?: number;
//   job_type: string;
//   posted_at: string;
// }

// interface Favorite {
//   id: string;
//   job_id: string;
//   added_at: string;
//   jobs: Job;
// }

// // Mock data
// const mockFavorites: Favorite[] = [
//   {
//     id: "1",
//     job_id: "job1",
//     added_at: "2024-01-10T10:00:00Z",
//     jobs: {
//       id: "job1",
//       title: "Senior Software Engineer",
//       employer_name: "TechCorp Inc",
//       city: "San Francisco",
//       state: "CA",
//       description:
//         "We are looking for a senior software engineer to join our growing team. You'll work on cutting-edge technologies and help build scalable applications.",
//       salary_min: 120000,
//       salary_max: 180000,
//       job_type: "Full-time",
//       posted_at: "2024-01-08T09:00:00Z",
//     },
//   },
//   {
//     id: "2",
//     job_id: "job2",
//     added_at: "2024-01-12T14:30:00Z",
//     jobs: {
//       id: "job2",
//       title: "Marketing Manager",
//       employer_name: "Growth Co",
//       city: "New York",
//       state: "NY",
//       description:
//         "Lead our marketing efforts and drive customer acquisition through innovative campaigns and strategies.",
//       salary_min: 80000,
//       salary_max: 120000,
//       job_type: "Full-time",
//       posted_at: "2024-01-10T11:00:00Z",
//     },
//   },
//   {
//     id: "3",
//     job_id: "job3",
//     added_at: "2024-01-14T16:45:00Z",
//     jobs: {
//       id: "job3",
//       title: "UX Designer",
//       employer_name: "Design Studio",
//       city: "Seattle",
//       state: "WA",
//       description:
//         "Create beautiful and intuitive user experiences for our digital products. Work closely with product and engineering teams.",
//       salary_min: 90000,
//       salary_max: 130000,
//       job_type: "Full-time",
//       posted_at: "2024-01-12T13:00:00Z",
//     },
//   },
//   {
//     id: "4",
//     job_id: "job4",
//     added_at: "2024-01-16T09:15:00Z",
//     jobs: {
//       id: "job4",
//       title: "Data Analyst",
//       employer_name: "Analytics Plus",
//       city: "Austin",
//       state: "TX",
//       description:
//         "Analyze complex datasets to drive business insights and support data-driven decision making across the organization.",
//       salary_min: 70000,
//       salary_max: 95000,
//       job_type: "Full-time",
//       posted_at: "2024-01-14T10:30:00Z",
//     },
//   },
//   {
//     id: "5",
//     job_id: "job5",
//     added_at: "2024-01-18T11:20:00Z",
//     jobs: {
//       id: "job5",
//       title: "Project Manager",
//       employer_name: "Consulting Group",
//       city: "Chicago",
//       state: "IL",
//       description:
//         "Manage multiple client projects simultaneously, ensuring timely delivery and client satisfaction.",
//       job_type: "Contract",
//       posted_at: "2024-01-16T08:00:00Z",
//     },
//   },
// ];

// export function FavoritesSection() {
//   const [favorites, setFavorites] = useState<Favorite[]>(mockFavorites);
//   const [filteredFavorites, setFilteredFavorites] =
//     useState<Favorite[]>(mockFavorites);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = favorites.filter(
//         (favorite) =>
//           favorite.jobs.title
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           favorite.jobs.employer_name
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           favorite.jobs.city.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredFavorites(filtered);
//     } else {
//       setFilteredFavorites(favorites);
//     }
//   }, [searchTerm, favorites]);

//   const removeFavorite = (jobId: string) => {
//     if (confirm("Are you sure you want to remove this job from favorites?")) {
//       setFavorites((prev) => prev.filter((fav) => fav.job_id !== jobId));
//       toast.success("Job removed from favorites!");
//     }
//   };

//   const viewJobDetails = (job: Job) => {
//     toast.success(`Viewing details for: ${job.title} at ${job.employer_name}`);
//   };

//   const formatSalary = (min?: number, max?: number) => {
//     if (!min && !max) return "Salary not specified";
//     if (min && max)
//       return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
//     if (min) return `From $${min.toLocaleString()}`;
//     if (max) return `Up to $${max.toLocaleString()}`;
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex sm:flex-row flex-col items-center justify-between">
//           <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold   leading-[1.2] mb-6">
//             Favorites ({favorites.length})
//           </h2>
//           <div className="relative sm:w-64 w-full">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-6 text-muted-foreground" />
//             <Input
//               placeholder="Search favorites..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 !text-base h-12"
//             />
//           </div>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {filteredFavorites.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-muted-foreground text-lg">
//               {favorites.length === 0
//                 ? "You haven't saved any jobs to favorites yet."
//                 : "No favorites match your search."}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredFavorites.map((favorite) => (
//               <div
//                 key={favorite.id}
//                 className="border relative rounded-lg p-4 hover:bg-muted/50 transition-colors"
//               >
//                 <div className="flex justify-between flex-wrap items-start mb-3">
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-2xl mb-3">
//                       {favorite.jobs.title}
//                     </h3>
//                     <div className="flex items-center gap-4 text-base text-muted-foreground mb-2">
//                       <div className="flex items-center gap-1">
//                         <Building className="size-6" />
//                         {favorite.jobs.employer_name}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <MapPin className="size-6" />
//                         {favorite.jobs.city}, {favorite.jobs.state}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 mb-2">
//                       <Badge variant="secondary" className="text-base">
//                         {favorite.jobs.job_type}
//                       </Badge>
//                       <div className="flex items-center gap-1 text-base text-muted-foreground">
//                         <DollarSign className="size-6" />
//                         {formatSalary(
//                           favorite.jobs.salary_min,
//                           favorite.jobs.salary_max
//                         )}
//                       </div>
//                     </div>
//                     <p className="text-base text-muted-foreground">
//                       Added on{" "}
//                       {new Date(favorite.added_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 {favorite.jobs.description && (
//                   <p className="text-base text-muted-foreground line-clamp-2">
//                     {favorite.jobs.description}
//                   </p>
//                 )}
//                 <div className="flex gap-2 flex-wrap md:ml-4 max-md:mt-5 md:absolute top-3 right-3">
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="text-base"
//                     onClick={() => viewJobDetails(favorite.jobs)}
//                   >
//                     <Eye className="size-6 mr-2" />
//                     View Details
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="lg"
//                     className="text-base"
//                     onClick={() => removeFavorite(favorite.job_id)}
//                   >
//                     <Trash2 className="size-6 mr-2" />
//                     Remove
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

//new code

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Trash2,
  Search,
  MapPin,
  Building,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Job {
  id: string;
  title: string;
  employer_name: string;
  city: string;
  state: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  posted_at: string;
}

interface Favorite {
  id: string;
  job_id: string;
  added_at: string;
  jobs: Job;
}

// Mock data remains the same (not translated)
const mockFavorites: Favorite[] = [
  {
    id: "1",
    job_id: "job1",
    added_at: "2024-01-10T10:00:00Z",
    jobs: {
      id: "job1",
      title: "Senior Software Engineer",
      employer_name: "TechCorp Inc",
      city: "San Francisco",
      state: "CA",
      description:
        "We are looking for a senior software engineer to join our growing team. You'll work on cutting-edge technologies and help build scalable applications.",
      salary_min: 120000,
      salary_max: 180000,
      job_type: "Full-time",
      posted_at: "2024-01-08T09:00:00Z",
    },
  },
  {
    id: "2",
    job_id: "job2",
    added_at: "2024-01-12T14:30:00Z",
    jobs: {
      id: "job2",
      title: "Marketing Manager",
      employer_name: "Growth Co",
      city: "New York",
      state: "NY",
      description:
        "Lead our marketing efforts and drive customer acquisition through innovative campaigns and strategies.",
      salary_min: 80000,
      salary_max: 120000,
      job_type: "Full-time",
      posted_at: "2024-01-10T11:00:00Z",
    },
  },
  {
    id: "3",
    job_id: "job3",
    added_at: "2024-01-14T16:45:00Z",
    jobs: {
      id: "job3",
      title: "UX Designer",
      employer_name: "Design Studio",
      city: "Seattle",
      state: "WA",
      description:
        "Create beautiful and intuitive user experiences for our digital products. Work closely with product and engineering teams.",
      salary_min: 90000,
      salary_max: 130000,
      job_type: "Full-time",
      posted_at: "2024-01-12T13:00:00Z",
    },
  },
  {
    id: "4",
    job_id: "job4",
    added_at: "2024-01-16T09:15:00Z",
    jobs: {
      id: "job4",
      title: "Data Analyst",
      employer_name: "Analytics Plus",
      city: "Austin",
      state: "TX",
      description:
        "Analyze complex datasets to drive business insights and support data-driven decision making across the organization.",
      salary_min: 70000,
      salary_max: 95000,
      job_type: "Full-time",
      posted_at: "2024-01-14T10:30:00Z",
    },
  },
  {
    id: "5",
    job_id: "job5",
    added_at: "2024-01-18T11:20:00Z",
    jobs: {
      id: "job5",
      title: "Project Manager",
      employer_name: "Consulting Group",
      city: "Chicago",
      state: "IL",
      description:
        "Manage multiple client projects simultaneously, ensuring timely delivery and client satisfaction.",
      job_type: "Contract",
      posted_at: "2024-01-16T08:00:00Z",
    },
  },
];

export function FavoritesSection() {
  const t = useTranslations("FavoritesSection");
  const [favorites, setFavorites] = useState<Favorite[]>(mockFavorites);
  const [filteredFavorites, setFilteredFavorites] =
    useState<Favorite[]>(mockFavorites);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      const filtered = favorites.filter(
        (favorite) =>
          favorite.jobs.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          favorite.jobs.employer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          favorite.jobs.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavorites(filtered);
    } else {
      setFilteredFavorites(favorites);
    }
  }, [searchTerm, favorites]);

  const removeFavorite = (jobId: string) => {
    if (confirm(t("confirmRemove"))) {
      setFavorites((prev) => prev.filter((fav) => fav.job_id !== jobId));
      toast.success(t("success.remove"));
    }
  };

  const viewJobDetails = (job: Job) => {
    toast.success(
      t("success.view", { title: job.title, company: job.employer_name })
    );
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t("salaryNotSpecified");
    if (min && max)
      return t("salaryRange", {
        min: min.toLocaleString(),
        max: max.toLocaleString(),
      });
    if (min) return t("salaryFrom", { min: min.toLocaleString() });
    if (max) return t("salaryUpTo", { max: max.toLocaleString() });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex sm:flex-row flex-col items-center justify-between">
          <h2 className="md:text-[40px] sm:text-[32px] text-[26px] font-bold leading-[1.2] mb-6">
            {t("title", { count: favorites.length })}
          </h2>
          <div className="relative sm:w-64 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-6 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !text-base h-12"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">
              {favorites.length === 0 ? t("emptyState") : t("noResults")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="border relative rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between flex-wrap items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-2xl mb-3">
                      {favorite.jobs.title}
                    </h3>
                    <div className="flex items-center gap-4 text-base text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Building className="size-6" />
                        {favorite.jobs.employer_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-6" />
                        {favorite.jobs.city}, {favorite.jobs.state}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-base">
                        {favorite.jobs.job_type}
                      </Badge>
                      <div className="flex items-center gap-1 text-base text-muted-foreground">
                        <DollarSign className="size-6" />
                        {formatSalary(
                          favorite.jobs.salary_min,
                          favorite.jobs.salary_max
                        )}
                      </div>
                    </div>
                    <p className="text-base text-muted-foreground">
                      {t("addedOn")}{" "}
                      {new Date(favorite.added_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {favorite.jobs.description && (
                  <p className="text-base text-muted-foreground line-clamp-2">
                    {favorite.jobs.description}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap md:ml-4 max-md:mt-5 md:absolute top-3 right-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base"
                    onClick={() => viewJobDetails(favorite.jobs)}
                  >
                    <Eye className="size-6 mr-2" />
                    {t("viewDetails")}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base"
                    onClick={() => removeFavorite(favorite.job_id)}
                  >
                    <Trash2 className="size-6 mr-2" />
                    {t("remove")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
