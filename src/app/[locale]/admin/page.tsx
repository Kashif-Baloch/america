import { redirect } from "@/i18n/navigation";

const Page = async ({
    params,
}: {
    params: Promise<{ locale: string }>;
}) => {
    const { locale } = await params
    return redirect({ href: "/admin/jobs", locale })
}

export default Page
