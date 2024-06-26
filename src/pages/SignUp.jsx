import { useState, useEffect } from 'react';
import { Avatar, Button, CssBaseline, TextField, MenuItem, Link, Grid, Box, Typography, Container, FormControlLabel, Checkbox, Stack } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { IconButton } from '@mui/material';
import Badge from '@mui/material/Badge';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from 'contexts/UserContext';
import { registerCandidate, registerRecruiter } from 'services/be_server/api_register';
import CreatableSelect from 'react-select/creatable';
import { getPresignedGetUrl, getPresignedPutUrl, putFileS3 } from 'services/be_server/api_uploadFIle';
import config from 'config.json';
import dayjs from 'dayjs';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        Đồ án tốt nghiệp
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const SignUpForm = () => {
  const [user, setUser] = useUserContext();
  const navigate = useNavigate();
  const [selectedOptionSkill, setSelectedOptionSkill] = useState(null);
  const [selectedOptionCompany, setSelectedOptionCompany] = useState(null);
  const [selectedOptionField, setSelectedOptionField] = useState(null);
  const [isContinue, setContinue] = useState(false);
  const [alreadyHadCompany, setAlreadyHadCompany] = useState(true);
  const [optionsSkill, setOptionsSkill] = useState(null);
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsField, setOptionsField] = useState(null);
  const [form, setForm] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [phoneInputError, setPhoneInputError] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [userSession, setUserSession] = useState({})
  const serverUrl = config.be_rootUrl;
  var urlSkills = serverUrl + "/skill";
  var urlCompany = serverUrl + "/company/select"
  var urlField = serverUrl + "/field";
  const [formRecruiter, setFormRecruiter] = useState({
    phoneNumber: '',
    fullName: '',
    address: '',
    position: '',
    isMale: '',
    avatar: '',
    dateOfBirth: null,
    companyName: '',
    companyWebSite: '',
    companyLocation: '',
    companyEmail: '',
    companyType: '',
    companySize: '',
    companyDescription: '',
    companyLogo: '',
    businessLicenseImg: '',
    isHadCompany: true
  });

  useEffect(() => {
    Promise.all([
      fetch(urlSkills, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Authorization": "Bearer " + user.token,
          "Content-Type": "application/json",
        },
        redirect: "follow"
      }).then(res => res.json())
      ,
      fetch(urlField, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Authorization": "Bearer " + user.token,
          "Content-Type": "application/json",
        },
        redirect: "follow"
      })
        .then(res => res.json()),
      fetch(urlCompany, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow"
      }).then(res => res.json())
    ])
      .then(([skillData, fieldData, companyData]) => {

        const skillOptions = skillData.map(skill => ({
          label: skill.name,
          value: skill.name,
          __isNew__: false
        }));
        setOptionsSkill(skillOptions);
        if (fieldData) {
          const fieldOptions = fieldData.map(field => ({
            label: field.name,
            value: field.id,
            __isNew__: false
          }));
          setOptionsField(fieldOptions);

        }

        if (companyData) {
          const companyOptions = companyData.map(company => ({
            label: company.name,
            value: company.id,
            __isNew__: false
          }));
          setOptionsCompany(companyOptions);

        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      })

  }, []);

  const handlePhoneValidate = (e) => {
    try {
      // thử parseInt để kiểm tra kiểu số nguyên
      if (isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 0)
        throw new Error()
      else {
        setPhoneInputError(false)
        const { name, value } = e.target;
        setFormRecruiter({
          ...formRecruiter,
          [name]: value,
        });
      }
    }
    catch {
      if (e.target.value === '')
        setPhoneInputError(false)
      else
        setPhoneInputError(true)
    }
  }

  const handleChangeRecruiter = (e) => {
    const { name, value } = e.target;
    setFormRecruiter({
      ...formRecruiter,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormRecruiter({
      ...formRecruiter,
      dateOfBirth: formattedDate,
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setFormRecruiter({
      ...formRecruiter,
      avatar: file,
    });
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCancle = () => {
    setForm('');
    setFormRecruiter({
      phoneNumber: '',
      fullName: '',
      address: '',
      position: '',
      isMale: '',
      dateOfBirth: null
    })
  }

  const handleRegisterCompany = () => {
    if (isContinue) {
      setContinue(false);
    } else {
      setContinue(true);
    }

  }

  const handleAlreadyHadCompany = (e) => {
    if (alreadyHadCompany) {
      setAlreadyHadCompany(false);
      setFormRecruiter({
        ...formRecruiter,
        ['isHadCompany']: false,
      });
    }
    else {
      setAlreadyHadCompany(true);
      setFormRecruiter({
        ...formRecruiter,
        ['isHadCompany']: true,
      });
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (phoneInputError) {
      document.getElementById('phoneNumber').focus();
      return;
    }

    setIsSending(true);
    const formData = new FormData(event.currentTarget);

    if (form === 'candidate') {
      selectedOptionSkill.map((skill, i) => {
        formData.append(`skills[${i}].value`, skill.value);
        formData.append(`skills[${i}].label`, skill.label);
        formData.append(`skills[${i}].__isNew__`, skill.__isNew__);
      });
      formData.append(`fieldId`, selectedOptionField.value);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const fileAvatar = formData.get('avatar');
      const fileCv = formData.get('cv');
      formData.delete('avatar');
      formData.delete('cv');
      const userResponse = await registerCandidate(user.token, formData)
        .then(result => {
          console.log('Register candidate result: ', result);

          return result;
        })
        .catch(error => {
          console.warn('Register candidate failed: ', error);
          alert('Đăng kí thất bại. Vui lòng thử lại sau.');
          setIsSending(false);
        })
      console.log(userResponse.id);
      if (userResponse.id) {
        const name = userResponse.id;
        const bucketCv = "cvfindjob"

        const presignedPutCvUrl = await getPresignedPutUrl(bucketCv, name, user.token)
        if (presignedPutCvUrl)
          await putFileS3(fileCv, presignedPutCvUrl.url);

        const bucketAvatar = "avatarfindjob";
        const presignedPutAvatarUrl = await getPresignedPutUrl(bucketAvatar, name, user.token);
        if (presignedPutAvatarUrl)
          await putFileS3(fileAvatar, presignedPutAvatarUrl.url);
        const presignedGetUrl = await getPresignedGetUrl(bucketAvatar, name, user.token);
        setUserSession({
          token: user.token,
          role: 'candidate',
          id: userResponse.id,
          fullName: String(userResponse.fullName),
          phoneNumber: String(userResponse.phoneNumber),
          email: String(userResponse.email),
          avatar: String(presignedGetUrl.url),
          gender: Boolean(userResponse.gender),
          dateOfBirth: Date(userResponse.dateOfBirth)
        })
        setIsSending(false);
        setForm('candidate-sended');
      }

    }
    else if (form === 'recruiter') {
      formData.append(`phoneNumber`, formRecruiter.phoneNumber);
      formData.append(`fullName`, formRecruiter.fullName);
      formData.append(`address`, formRecruiter.address);
      formData.append(`position`, formRecruiter.position);
      formData.append(`dateOfBirth`, formRecruiter.dateOfBirth);
      formData.append(`avatar`, formRecruiter.avatar);
      formData.append(`isHadCompany`, formRecruiter.isHadCompany);
      if (formRecruiter.isHadCompany)
        formData.append(`companyId`, selectedOptionCompany.value);
      else
        formData.append(`companyId`, 0);
      for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const fileAvatar = formRecruiter.avatar;
      const fileCompany = formData.get('businessLicenseImg');
      formData.delete('avatar');
      formData.delete('businessLicenseImg');
      const userResponse = await registerRecruiter(user.token, formData)
        .then(result => {
          console.log('Register recruiter result: ', result);

          return result;
        })
        .catch(error => {
          console.warn('Register recruiter failed: ', error);
          alert('Đăng kí thất bại. Vui lòng thử lại sau.');
          setIsSending(false);
        })
      if (userResponse.id) {
        const name = userResponse.id;
        if (!formRecruiter.isHadCompany) {
          const nameCompany = userResponse.companyId;
          const bucketCompany = "companyfindjob"
          const presignedPutBusinessLicenseImgUrl = await getPresignedPutUrl(bucketCompany, nameCompany, user.token)

          if (presignedPutBusinessLicenseImgUrl)
            await putFileS3(fileCompany, presignedPutBusinessLicenseImgUrl.url);
        }
        const bucketAvatar = "avatarfindjob";
        const presignedPutAvatarUrl = await getPresignedPutUrl(bucketAvatar, name, user.token);

        if (presignedPutAvatarUrl)
          await putFileS3(fileAvatar, presignedPutAvatarUrl.url);
        const presignedGetUrl = await getPresignedGetUrl(bucketAvatar, name, user.token);
        setUserSession({
          token: user.token,
          role: 'recruiter',
          id: userResponse.id,
          fullName: String(userResponse.fullName),
          phoneNumber: String(userResponse.phoneNumber),
          email: String(userResponse.email),
          avatar: String(presignedGetUrl.url),
          gender: Boolean(userResponse.gender),
          dateOfBirth: Date(userResponse.dateOfBirth)
        })
        setIsSending(false);
        setForm('candidate-sended');
      }
    };
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: '53px', // Đặt chiều cao của phần tử
      minHeight: '53px' // Đặt chiều cao tối thiểu của phần tử để đảm bảo không bị ghi đè
    })
  };

  if (form === 'recruiter')
    return (
      <div className=" w-full flex-row-2 block mt-6 max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

          {

            isContinue ? <>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" onChange={handleAlreadyHadCompany} />}
                  label="Tôi chưa có công ty"
                />
              </Grid>
              {
                alreadyHadCompany ? <>
                  <Grid item xs={12}>
                    <CreatableSelect
                      fullWidth
                      onChange={setSelectedOptionCompany}
                      options={optionsCompany}
                      className='create-select-input'
                      sx={{ mb: 2 }}
                      styles={customStyles}

                    />
                  </Grid>
                </> :
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          type="tel"
                          id="companyName"
                          label="Tên công ty"
                          name="companyName"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="companyWebSite"
                          label="Website công ty"
                          name="companyWebSite"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          id="companyLocation"
                          label="Địa chỉ công ty"
                          name="companyLocation"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="companyEmail"
                          label="Email công ty"
                          name="companyEmail"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="companyType"
                          label="Loại công ty"
                          name="companyType"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="companySize"
                          label="Quy mô công ty"
                          name="companySize"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="companyDescription"
                          label="Mô tả công ty"
                          name="companyDescription"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          id="companyLogo"
                          label="Logo công ty"
                          name="companyLogo"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          type='file'
                          inputProps={{ accept: 'image/*' }}
                          id="businessLicenseImg"
                          label="Giấy phép kinh doanh"
                          name="businessLicenseImg"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>


                    </Grid>
                  </>
              }
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox required value="allowExtraEmails" color="primary" />}
                  label="Tôi đã đọc và đồng ý với Chính sách của công ty"
                />
              </Grid>
            </> : <>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      sx={{
                        backgroundColor: 'gray',
                      }}
                      component="label"
                    >
                      <PhotoCamera />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        id="avatar"
                        name="avatar"
                        onChange={handleAvatarChange}
                      />
                    </IconButton>
                  }
                >
                  <Avatar alt="Travis Howard" sx={{ width: 100, height: 100 }} src={avatarPreview} />
                </Badge>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="tel"
                    id="phoneNumber"
                    label="Số điện thoại"
                    name="phoneNumber"
                    autoComplete="tel"
                    autoFocus
                    error={phoneInputError}
                    value={formRecruiter.phoneNumber}
                    helperText={phoneInputError ? 'Sai định dạng số điện thoại' : ''}
                    onChange={handlePhoneValidate}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="fullName"
                    label="Họ tên"
                    name="fullName"
                    autoComplete="name"
                    value={formRecruiter.fullName}
                    onChange={handleChangeRecruiter}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="address"
                    label="Địa chỉ"
                    name="address"
                    autoComplete="name"
                    value={formRecruiter.address}
                    onChange={handleChangeRecruiter}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="position"
                    label="Vị trí công tác"
                    name="position"
                    autoComplete="name"
                    value={formRecruiter.position}
                    onChange={handleChangeRecruiter}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    id="isMale"
                    label="Giới tính"
                    name="isMale"
                    autoComplete='sex'
                    value={formRecruiter.isMale}
                    onChange={handleChangeRecruiter}
                  >
                    <MenuItem value={'true'}>Nam</MenuItem>
                    <MenuItem value={'false'}>Nữ</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
                    <DatePicker label="Ngày sinh" disableFuture
                      format='YYYY-MM-DD'
                      value={formRecruiter.dateOfBirth}
                      required
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          id: "dateOfBirth",
                          name: "dateOfBirth"
                        },
                        actionBar: {
                          actions: ['clear']
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>


            </>
          }
          {
            isContinue ? <>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                loading={isSending}
                sx={{ mt: 2, mb: 2 }}
              >
                Đăng kí
              </LoadingButton>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={handleRegisterCompany}
              >
                Quay lại
              </Button>
            </> : <>
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handleRegisterCompany}
                sx={{ mt: 2, mb: 2 }}
              >
                Tiếp tục
              </Button>
              <Button
                type="reset"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={handleCancle}
              >
                Hủy
              </Button>
            </>
          }

        </Box>
      </div>
    )
  else if (form === 'recruiter-sended') {

    setTimeout(async () => {
      const userSession = { token: user.token, role: 'recruiter' };
      setUser(userSession);
      navigate('/recruiter');
    }, 3000);

    return (
      <Stack maxWidth='80%' margin={2} spacing={2}>
        <Typography>
          Đăng kí nhà tuyển dụng thành công. Tự động đăng nhập.
        </Typography>
      </Stack>
    )
  }
  else if (form === 'candidate')
    return (
      <div className=" w-full flex-row-2 block mt-6 max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, maxWidth: '1000px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  sx={{
                    backgroundColor: 'gray',
                  }}
                  component="label"
                >
                  <PhotoCamera />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="avatar"
                    name="avatar"
                    onChange={handleAvatarChange}
                  />
                </IconButton>
              }
            >
              <Avatar alt="Travis Howard" sx={{ width: 100, height: 100 }} src={avatarPreview} />
            </Badge>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="tel"
                id="phoneNumber"
                label="Số điện thoại"
                name="phoneNumber"
                autoComplete="tel"
                autoFocus
                error={phoneInputError}
                helperText={phoneInputError ? 'Sai định dạng số điện thoại' : ''}
                onChange={handlePhoneValidate}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                id="fullName"
                label="Họ tên"
                name="fullName"
                autoComplete="name"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                id="address"
                label="Địa chỉ"
                name="address"
                autoComplete="address"
                sx={{ mb: 2 }}
              />

            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                id="gender"
                label="Giới tính"
                name="gender"
                autoComplete='sex'
                sx={{ mb: 2 }}
              >
                <MenuItem value={'true'}>Nam</MenuItem>
                <MenuItem value={'false'}>Nữ</MenuItem>
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
                <DatePicker
                  label="Ngày sinh"
                  disableFuture
                  required
                  format='YYYY-MM-DD'
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      id: "dateOfBirth",
                      name: "dateOfBirth"
                    },
                    actionBar: {
                      actions: ['clear']
                    }
                  }}
                  sx={{ mb: 2 }}
                />
              </LocalizationProvider>

              <CreatableSelect
                fullWidth
                onChange={setSelectedOptionField}
                options={optionsField}
                sx={{ mb: 2 }}
                className='create-select-input '
                styles={customStyles}

              />
              
            </Grid>
            <CreatableSelect
              fullWidth
              onChange={setSelectedOptionSkill}
              options={optionsSkill}
              isMulti
              className='create-select-input ml-4'
              sx={{ mb: 2  }}
              styles={customStyles}
            />
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='file'
                inputProps={{ accept: 'pdf/*' }}
                id="cv"
                label="CV"
                name="cv"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={isSending}
            sx={{ mt: 2, mb: 2 }}
          >
            Đăng kí
          </LoadingButton>
          <Button
            type="reset"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={() => setForm('')}
          >
            Hủy
          </Button>

        </Box>
      </div>
    )
  else if (form === 'candidate-sended') {
    setTimeout(async () => {
      setUser(userSession);
      navigate('/home');
    }, 3000);

    return (
      <Stack maxWidth='80%' margin={2} spacing={2}>
        <Typography>
          Đăng kí khách hàng thành công. Tự động đăng nhập.
        </Typography>
      </Stack>
    )
  }
  else
    return (
      <Stack maxWidth='80%' margin={2} spacing={2}>
        <Typography>
          Chào mừng bạn đến với FindJob. Bạn đăng kí với vai trò gì.
        </Typography>
        <Button fullWidth variant="outlined" onClick={() => setForm('candidate')}>
          Tôi là người ứng tuyển
        </Button>
        <Button fullWidth variant="outlined" onClick={() => setForm('recruiter')}>
          Tôi là người tuyển dụng
        </Button>
      </Stack>
    )
}

const defaultTheme = createTheme();

export default function SignUp() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth='sm'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <SignUpForm />
        </Box>
        <Copyright sx={{ mt: 5, mb: 2 }} />
      </Container>
    </ThemeProvider>
  );
}