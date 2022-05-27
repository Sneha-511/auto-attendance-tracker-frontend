import isValidUrl from './isValidUrl';
import validateEmail from './validateEmail';

let socialFormData = {};
let errorList = [];
const validateSocialField = (key, value) => {
  if (key === 'mail') {
    if (value !== '' && validateEmail(value)) {
      socialFormData = { ...socialFormData, [key]: value };
      return;
    }

    if (value !== '' && !validateEmail(value)) {
      errorList.push('Please enter a valid email id.');
      return;
    }
  }

  if (key === 'phone') {
    if (value !== '') {
      if (value.length === 10) {
        socialFormData = { ...socialFormData, [key]: value };
      } else {
        errorList.push('Please enter a valid phone number');
      }
    }
    return;
  }

  if (value !== '' && isValidUrl(value)) {
    socialFormData = { ...socialFormData, [key]: value };
    return;
  }

  if (!isValidUrl(value) && value !== '') {
    errorList.push(`Please enter a valid ${key} url.`);
    return;
  }
};

export const validateAddEditContactForm = ({ name, position, imageUrl, mail, linkedin, facebook, phone }) => {
  errorList = [];
  socialFormData = {};
  // Corner Case above
  if (name === '' || position === '' || imageUrl === '') {
    errorList.push('Name, position and image url is required!');
  } else {
    if (!isValidUrl(imageUrl)) {
      errorList.push('Please enter a valid image url.');
    } else {
      validateSocialField('facebook', facebook);
      validateSocialField('linkedin', linkedin);
      validateSocialField('mail', mail);
      validateSocialField('phone', phone);

      if (Object.keys(socialFormData).length === 0) {
        errorList.push('Please enter atleast one of the facebook, linkedin, mail or phone details');
      }
    }
  }
  return { errorList, socialFormData };
};
