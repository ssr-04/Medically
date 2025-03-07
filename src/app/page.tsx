import { getAllUpcomingMeds } from "@/actions/home.action";
import CustomSignInButton from "@/components/CustomSignInButton";
import { Button } from "@/components/ui/button";
import UpcomingMedicationCard from "@/components/UpcomingMedicationCard";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Home = async () => {
  const UpcomingMeds = await getAllUpcomingMeds();
  const user = await currentUser();

  if(!user){
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <h3 className="font-bold text-xl">Welcome to Medicaly!</h3>
        <p className="text-muted-foreground">Sign in to get started.</p>
        <CustomSignInButton />
      </div>
    )
  }
  
  // console.log(JSON.stringify(UpcomingMeds, null, 2)); 
  if(UpcomingMeds?.length===0){
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <h3 className="font-bold text-xl">No upcoming medications found!</h3>
        <p className="text-muted-foreground">Navigate to Conditions or Medications to get started.</p>
      </div>
    )
  }
  return (
    <div className='mx-6 p-3 space-y-7'>
      <h1 className="mt-5 font-bold text-2xl text-center font-mono">Welcome back {user?.firstName} 👋</h1>
      <h3 className="text-xl font-bold">Upcoming Medications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {UpcomingMeds?.map((medication) => (
          <UpcomingMedicationCard key={medication.id} medication={medication} />
        ))}
      </div>
    </div>
  )
}

export default Home
