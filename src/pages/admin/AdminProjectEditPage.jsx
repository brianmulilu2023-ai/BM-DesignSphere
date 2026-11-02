import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectForm } from '../../components/admin/ProjectForm';
import { fetchProjectById } from '../../lib/portfolioService';
import { Loader2 } from 'lucide-react';

export function AdminProjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const found = await fetchProjectById(id);
        if (!found) {
          navigate('/admin/projects', { replace: true });
          return;
        }
        setProject(found);
      } catch (e) {
        navigate('/admin/projects', { replace: true });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF751F]" />
      </div>
    );
  }

  return (
    <div>
      <ProjectForm initialData={project} isEdit={true} />
    </div>
  );
}

