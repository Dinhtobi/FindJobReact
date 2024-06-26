import React, { useState, useEffect } from "react";
import { Avatar, Button, TextField, MenuItem, Grid, Box, Typography, } from '@mui/material';
import { Card, CardContent, CardMedia, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Badge from '@mui/material/Badge';
import { CloudUpload, Visibility } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';
import { LoadingButton } from '@mui/lab';
import { useUserContext } from 'contexts/UserContext';
import { updateCandidate } from 'services/be_server/api_register';
import CreatableSelect from 'react-select/creatable';
import config from 'config.json';
import dayjs from 'dayjs';
import PageHeader from "features/home/components/PageHeader";
import { delFileS3, getPresignedGetUrl, getPresignedPutUrl, putFileS3 } from "services/be_server/api_uploadFIle";

const Profile = () => {

    const [user, setUser] = useUserContext();
    const [profile, setProfile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [cvUrl, setCvUrl] = useState("");

    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [isDisabled, setDisabled] = useState(true);
    const [isUpdateAvatar, setUpddateAvatar] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState(null);
    const [form, setForm] = useState('candidate');
    const [isSending, setIsSending] = useState(false);
    const [phoneInputError, setPhoneInputError] = useState(false);
    const [selectedOptionField, setSelectedOptionField] = useState(null);
    const [optionsField, setOptionsField] = useState(null);

    const serverUrl = config.be_rootUrl;
    var urlString = serverUrl + "/candidate";
    var urlSkills = serverUrl + "/skill";
    var urlField= serverUrl + "/field";
    useEffect(() => {
        Promise.all([
            fetch(urlString, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json",
                },
                redirect: "follow"
            })
                .then(res => res.json())
                .then(data => {
                    return data;
                })
                .catch(error => {
                    console.warn("Get profile error: " + error);
                    throw error;
                })
            ,
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
                .then(result => {
                    return result;
                })
                .catch(error => {
                    console.warn("Company is empty: " + error);
                    throw error;
                })
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
                    .then(res => res.json())
                    .catch(error => {
                        console.warn("Field is empty: " + error);
                        throw error;
                    })
                    ,
        ])
            .then(([profileData, skillData,fieldData]) => {
                setProfile(profileData);
                setAvatarPreview(profileData.avatarUrl);
                setDateOfBirth(dayjs(profileData.dateOfBirth))
                setCvUrl(profileData.cvUrl);
                const skillOptions = profileData.skills.map(skill => ({
                    label: skill.name,
                    value: skill.name,
                    __isNew__: false
                }));
                setSelectedOption(skillOptions);
                const fieldOptions = {
                    label: profileData.field.name,
                    value: profileData.field.id,
                    __isNew__: false
                };
                setSelectedOptionField(fieldOptions);
                setIsLoading(false);
                if (skillData) {

                    const skillOptions = skillData.map(skill => ({
                        label: skill.name,
                        value: skill.name,
                        __isNew__: false
                    }));
                    setOptions(skillOptions);
                }

                if (fieldData) {
                    const fieldOptions = fieldData.map(field => ({
                      label: field.name,
                      value: field.id,
                      __isNew__: false
                    }));
                    setOptionsField(fieldOptions);
          
                  }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);


    const handlePhoneValidate = (e) => {
        try {
            // thử parseInt để kiểm tra kiểu số nguyên
            if (isNaN(parseInt(e.target.value)) || parseInt(e.target.value) < 0)
                throw new Error()
            else {
                setPhoneInputError(false)
            }
        }
        catch {
            if (e.target.value === '')
                setPhoneInputError(false)
            else
                setPhoneInputError(true)
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
        selectedOption.map((skill, i) => {
            formData.append(`skills[${i}].value`, skill.value);
            formData.append(`skills[${i}].label`, skill.label);
            formData.append(`skills[${i}].__isNew__`, skill.__isNew__);
        });
        formData.append(`fieldId`,selectedOptionField.value);

        const name = profile.id;
        if (isUpdateAvatar) {
            const bucket = "avatarfindjob";
            const deleteCVUrl = await delFileS3(bucket, name, user.token);
            if (deleteCVUrl.data) {
                const presignedPutUrl = await getPresignedPutUrl(bucket, name, user.token);
                if (presignedPutUrl)
                    await putFileS3(formData.get('avatar'), presignedPutUrl.url);
                const presignedGetUrl = await getPresignedGetUrl(bucket, name, user.token);
                if (presignedGetUrl)
                    setCvUrl(presignedGetUrl.url);
            }
        }
        formData.delete('avatar');
        formData.append('avatar', name);
        await updateCandidate(user.token, formData, user.id)
            .then(result => {
                console.log('Update candidate result: ', result);
                setIsSending(false);
            })
            .catch(error => {
                console.warn('Update candidate failed: ', error);
                alert('Cập nhật thất bại. Vui lòng thử lại sau.');
                setIsSending(false);
            })
        setDisabled(!isDisabled);
    };


    const handleUploadCV = async (event) => {
        const file = event.target.files[0];
        const name = user.id;
        const bucket = "cvfindjob"
        const deleteCVUrl = await delFileS3(bucket, name, user.token);

        if (deleteCVUrl.data) {
            const presignedPutUrl = await getPresignedPutUrl(bucket, name, user.token)
            if (presignedPutUrl)
                await putFileS3(file, presignedPutUrl.url);
            alert("Bạn đã thay đổi CV");
            const presignedGetUrl = await getPresignedGetUrl(bucket, name, user.token);
            if (presignedGetUrl)
                setCvUrl(presignedGetUrl.url);
        }

    }



    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        setUpddateAvatar(true);
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleDisabled = () => {
        if (isDisabled)
            setDisabled(!isDisabled);
        else
            setDisabled(!isDisabled);
    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            height: '53px', // Đặt chiều cao của phần tử
            minHeight: '53px' // Đặt chiều cao tối thiểu của phần tử để đảm bảo không bị ghi đè
        })
    };

    if (form === 'candidate')
        return (
            <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
                {
                    isLoading ? <>
                        <h1>Đang tải</h1>
                    </> : <>
                        <PageHeader title={"Hồ sơ cá nhân"} path={"profile"} />
                        <div className="flex flex-col-2 gap-8 ">

                            <div className=" w-3/4 flex-row-2 block mt-6 max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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
                                                        disabled={isDisabled}
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
                                                disabled={isDisabled}
                                                defaultValue={profile.phoneNumber}
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
                                                disabled={isDisabled}
                                                defaultValue={profile.fullName}
                                                autoComplete="name"
                                                sx={{ mb: 2 }}
                                            />
                                            <TextField
                                                fullWidth
                                                id="address"
                                                label="Địa chỉ"
                                                disabled={isDisabled}
                                                defaultValue={profile.address}
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
                                                disabled={isDisabled}
                                                defaultValue={profile.gender}
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
                                                    format='YYYY-MM-DD'
                                                    disabled={isDisabled}
                                                    value={dateOfBirth}
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
                                                value={selectedOptionField}
                                                isDisabled={isDisabled}
                                                sx={{ mb: 2 }}
                                                className='create-select-input '
                                                styles={customStyles}

                                            />

                                        </Grid>
                                        <CreatableSelect
                                            onChange={setSelectedOption}
                                            options={options}
                                            value={selectedOption}
                                            isDisabled={isDisabled}
                                            isMulti
                                            className='create-select-input ml-4'
                                            sx={{ mb: 2 }}
                                            styles={customStyles}
                                        />
                                    </Grid>
                                    {
                                        isDisabled ? <>
                                            <LoadingButton
                                                type="button"
                                                fullWidth
                                                variant="contained"
                                                loading={isSending}
                                                sx={{ mt: 2, mb: 2 }}
                                                onClick={handleDisabled}
                                            >
                                                Cập nhật
                                            </LoadingButton>
                                        </> : <>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                loading={isSending}
                                                sx={{ mt: 2, mb: 2 }}
                                            >
                                                Lưu
                                            </Button>
                                            <Button
                                                type="button"
                                                fullWidth
                                                variant="outlined"
                                                sx={{ mb: 2 }}
                                                onClick={handleDisabled}
                                            >
                                                Hủy
                                            </Button>
                                        </>
                                    }
                                </Box>
                            </div>
                            <div className="w-1/4 mt-6 max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: 2 }}>
                                    <Card sx={{ maxWidth: 300 }}>
                                        <CardMedia
                                            component="img"
                                            alt="CV Preview"
                                            height="140"
                                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWRzNfpd-ehVj2fAP5BE2CszLhx4xztMx3Bg&s" // Link đến ảnh CV preview
                                            title="CV Preview"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {profile.fullName}
                                            </Typography>
                                        </CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                            <IconButton aria-label="download">
                                                <Visibility onClick={() => window.open(cvUrl, "_blank")} />
                                            </IconButton>
                                            <IconButton aria-label="upload"
                                                component="label">
                                                <CloudUpload />
                                                <input
                                                    disabled={false}
                                                    type="file"
                                                    accept="pdf/*"
                                                    hidden
                                                    id="cv"
                                                    name="cv"
                                                    onChange={handleUploadCV}
                                                />
                                            </IconButton>
                                        </Box>
                                    </Card>

                                </Box>
                            </div>
                        </div>

                    </>
                }
            </div>
        )
}

export default Profile;