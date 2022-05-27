import React from 'react';
import FormTextField from './FormTextField';
import ImageUrlInput from '../../common/ImageUrlInput';

const AddEditStudentForm = ({ data, setData }) => {
  return (
    <>
      <FormTextField attr={'name'} label={'Name'} data={data} setData={setData} />
      <br />
      <FormTextField attr={'admNo'} label={'Admission Number'} data={data} setData={setData} />
      <br />
      <ImageUrlInput
        label={'Image URL'}
        margin="normal"
        value={data.imageUrl}
        onChange={(e) => {
          setData({ ...data, imageUrl: e.target.value });
        }}
        required={true}
      />
    </>
  );
};

export default AddEditStudentForm;
