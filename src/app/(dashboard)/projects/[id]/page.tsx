interface PageProps {
  params: { id: string };
}

export default function ProjectDetailsPage({ params }: PageProps) {
  return <div className="p-4">Project {params.id} - Coming soon</div>;
}
