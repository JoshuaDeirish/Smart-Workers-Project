import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatabase, useUser} from "reactfire";


export function useAuthRedirect() {
  const user = useUser();
  const navigate = useNavigate();

  // Check if user is signed in
  if (!user.data) {
    // Redirect to the login page
    navigate("/login");
  }
}
export function useEmployerAuthRedirect() {
  const user = useUser();
  const navigate = useNavigate();
  const database = useDatabase();
  const employersCollection = collection(database, "Employers");
  const [isEmployer, setIsEmployer] = useState(true);

  useEffect(() => {
    const checkIfEmployer = async () => {
      if (user && user.data) {
        const employersQuery = query(
          employersCollection,
          where("email", "==", user.data.email)
        );
  
        try {
          const querySnapshot = await getDocs(employersQuery);
          setIsEmployer(querySnapshot.empty);

          // Redirect to the login page if the user is not an employer
          if (querySnapshot.empty) {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error checking if employer:", error);
          setIsEmployer(false);
        }
      }
    };
  
    checkIfEmployer();
  }, [database, employersCollection, navigate, user]);

  // No need for an additional check here
}
export function useJobSeekerAuthRedirect() {
  const user = useUser();
  const navigate = useNavigate();
  const database = useDatabase();
  const jobSeekersCollection = collection(database, "JobSeekers");
  const [isJobSeeker, setIsJobSeeker] = useState(true);

  useEffect(() => {
    const checkIfJobSeeker = async () => {
      if (user && user.data) {
        const jobSeekerQuery = query(
          jobSeekersCollection,
          where("email", "==", user.data.email)
        );
  
        try {
          const querySnapshot = await getDocs(jobSeekerQuery);
          setIsJobSeeker(querySnapshot.empty);

          // Redirect to the login page if the user is not an employer
          if (querySnapshot.empty) {
            navigate("/login");
          }
        } catch (error) {
          console.error("Error checking if employer:", error);
          setIsJobSeeker(false);
        }
      }
    };
  
    checkIfJobSeeker();
  }, [database, jobSeekersCollection, navigate, user]);

  // No need for an additional check here
}
