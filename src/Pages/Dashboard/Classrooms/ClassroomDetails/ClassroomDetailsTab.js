import React from 'react';
import showToast from '../../../../utils/showToastNotification';
import DetailForm from '../../../../components/classrooms/details/DetailForm';
import { SUCCESS } from '../../../../store/types';

function ClassroomDetailsTab({ classroom, setClassroom }) {
  if (!classroom) return null;

  const { id, name, startYear, endYear, imageUrl } = classroom;

  return (
    <DetailForm
      id={id}
      name={name}
      startYear={startYear}
      endYear={endYear}
      imageUrl={imageUrl}
      onSuccess={(data) => {
        setClassroom(data);
        showToast(SUCCESS, 'Changes saved successfully!');
      }}
    />
  );
}

export default ClassroomDetailsTab;
