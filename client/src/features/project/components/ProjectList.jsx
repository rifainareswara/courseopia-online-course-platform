import { useTitle } from "@/hooks/useTitle";
import { useGetProjectsQuery } from "../api/projectApiSlice";
import ProjectCard from "./ProjectCard";
import { useAuth } from "@/hooks/useAuth";

export default function ProjectList() {
  useTitle("Progetti | Courseopia");

  const {
    data: projectsData,
    isLoading,
    isError,
    isSuccess,
  } = useGetProjectsQuery("projectsList", {
    pollingInterval: 1000 * 60 * 1, // 1 minute
  });

  const { isAdmin, isTeacher, id } = useAuth();

  const projectsToReview = projectsData?.filter((project) =>
    isAdmin
      ? project.isCorrect === false
      : isTeacher
      ? project.isCorrect === false && project.course.teacher === id
      : ""
  );

  const projectsCorrected = projectsData?.filter((project) =>
    isAdmin
      ? project.isCorrect === true
      : isTeacher
      ? project.isCorrect === true && project.course.teacher === id
      : ""
  );

  return (
    <>
      <div>
        {isLoading && <div>Memuat...</div>}
        {isError && <div>Terjadi kesalahan saat memuat kursus.</div>}
        <h2 className="text-3xl font-bold mb-12">Proyek</h2>
        <div className="flex flex-col gap-24">
          <div>
            <h3 className="text-1xl font-bold mb-4">Proyek yang akan diperbaiki</h3>
            {isSuccess && (
              <div className="flex flex-col gap-2">
                {projectsToReview.length > 0 ? (
                  projectsToReview.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      course={project.course}
                    />
                  ))
                ) : (
                  <div>Tidak ada proyek untuk diperbaiki</div>
                )}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-1xl font-bold mb-4">Proyek yang sudah diperbaiki</h3>
            {isSuccess && (
              <div className="flex flex-col gap-2">
                {projectsCorrected.length > 0 ? (
                  projectsCorrected.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      course={project.course}
                    />
                  ))
                ) : (
                  <div>Tidak ada proyek yang sudah diperbaiki</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
