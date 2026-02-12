import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
    password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
});

export const signupSchema = z
    .object({
        nickname: z
            .string()
            .min(2, { message: "닉네임은 2자 이상이어야 합니다." })
            .max(20, { message: "닉네임은 20자 이하여야 합니다." }),
        email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
        password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordConfirm"],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
