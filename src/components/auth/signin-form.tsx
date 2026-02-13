import { cn } from "@/lib/utils"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"


const signupSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const errorTextClass = "text-[13px] text-rose-600";
  const {signIn} = useAuthStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignupFormValues) => {
    const {email , password} = data
    const isSignedIn = await signIn(email, password)
    if (isSignedIn) {
      navigate('/')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)} >
            <div className=" flex flex-col gap-6">

              {/* logo-header */}
              <div className=" flex flex-col items-center text-center">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img className="w-[100px] h-[100px] mt-[-30px] object-cover" src="/logoben10.svg" alt="" />
                </a> 
                <h1 className="text-2xl font-bold"> SIGN IN Postion</h1>

                <p className="text-muted-foreground text-balance ">Wellcome back to signin</p>
              </div>

              {/* userName  */}
              {/* <div className="flex flex-col">
                <Label htmlFor="userName" className="font-bold">
                  Tên Đăng Nhập
                </Label>
                <Input  {...register("userName")} type="text" id="userName" />
                {errors.userName && (
                  <p className={errorTextClass}>{errors.userName.message}</p>
                )}
              </div> */}

              {/* email */}
              <div className="flex flex-col">
                <Label htmlFor="email" className="font-bold">
                  Email
                </Label>
                <Input {...register("email")} type="email" id="email" placeholder="email" />
                {errors.email && (
                  <p className={errorTextClass}>{errors.email.message}</p>
                )}
              </div>

              {/* password */}
              <div className="flex flex-col">
                <Label className="font-bold" htmlFor="password">
                  Mật Khẩu
                </Label>
                <Input {...register("password")} type="password" id="password" autoComplete="false" placeholder="password" />
                {errors.password && (
                  <p className={errorTextClass}>{errors.password.message}</p>
                )}
              </div>

              {/* signup button  */}
              <Button type="submit"
                className="w-full">
                Dang nhap 
              </Button>

              <div className=" text-center ">
                Not have account ? {''}<a href="/signup">Sign Up</a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://img.freepik.com/vector-premium/concepto-firma-digital_118813-2673.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="px-6 text-center">
        Bằng cách tiếp tục, bạn đồng ý với  <a href="#">điều khoản dịch vụ và </a>{" "}
        <a href="#">chính sách bảo mật</a>.
      </div>
    </div>
  )
}
