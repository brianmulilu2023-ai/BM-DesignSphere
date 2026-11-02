import React from 'react';
import { ProjectForm } from '../../components/admin/ProjectForm';

export function AdminProjectNewPage() {
  return (
    <div>
      <ProjectForm isEdit={false} />
    </div>
  );
}

