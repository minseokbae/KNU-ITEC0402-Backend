import { useEffect, useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [message, setMessage] = useState(''); // 메시지 상태 (성공/실패 메시지)
  const navigate = useNavigate(); // React Router에서 페이지 이동을 위해 사용

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowPasswordConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true); // 제출 상태 활성화

    // 유효성 검사 (Formik의 validationSchema로 처리됨)
    if (values.password !== values.confirmPassword) {
      setMessage('Passwords do not match');
      setSubmitting(false);
      return;
    }

    try {
      // 회원가입 API 호출
      const response = await fetch('http://222.103.41.58:5326/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: values.email, // 이메일(아이디)
          password: values.password, // 비밀번호
          confirmPassword: values.confirmPassword, // 비밀번호 확인
          companyName: values.companyName // 회사 이름 추가
        })
      });

      // 응답 처리
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // 성공 메시지 설정
        navigate('/login'); // 로그인 페이지로 이동
      } else {
        const errorData = await response.json();
        setMessage(errorData.message); // 오류 메시지 설정
      }
    } catch (error) {
      setMessage('Failed to register. Please try again.');
    } finally {
      setSubmitting(false); // 제출 상태 비활성화
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          companyName: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('올바른 형식의 이메일이어야 합니다.').max(255).required('이메일을 입력하세요.'),
          companyName: Yup.string().max(255).required('회사 이름을 입력하세요.'),
          password: Yup.string().max(255).required('비밀번호를 입력하세요.'),
          confirmPassword: Yup.string()
            .max(255)
            .oneOf([Yup.ref('password'), null], '비밀번호와 일치하지 않습니다.')
            .required('비밀번호 확인을 입력하세요.')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {' '}
            {/* onSubmit 수정 */}
            <Grid container spacing={3}>
              {/* 이메일 입력 필드 */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">이메일 주소*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@company.com"
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>

              {/* 회사 이름 입력 필드 */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="companyName-signup">회사 이름*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.companyName && errors.companyName)}
                    id="companyName-signup"
                    type="text"
                    value={values.companyName}
                    name="companyName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                  />
                </Stack>
                {touched.companyName && errors.companyName && (
                  <FormHelperText error id="helper-text-companyName-signup">
                    {errors.companyName}
                  </FormHelperText>
                )}
              </Grid>

              {/* 비밀번호 입력 필드 */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">비밀번호</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              {/* 비밀번호 확인 필드 */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confirmPassword-signup">비밀번호 확인</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirmPassword-signup"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordConfirm}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPasswordConfirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                </Stack>
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error id="helper-text-confirmPassword-signup">
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </Grid>

              {/* 폼 제출 버튼 */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    회원가입
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
