// "use client";
// // import { useUser } from "@/app/referrals/context/UserContext";
// import { useUser } from "@/app/context/UserContext";



// export default function DashboardPage() {
//   const { user } = useUser();

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
//         <h1 className="text-2xl font-bold mb-4 text-center">
//           Welcome to your Dashboard
//         </h1>
//         <p className="mb-2">Hello <strong>{user?.email}</strong></p>
//         <p className="mb-2">Role: {user?.role}</p>
//         <p className="mb-2">Registered: {new Date(user?.created_at).toLocaleString()}</p>
//       </div>
//     </div>
//   );
// }
