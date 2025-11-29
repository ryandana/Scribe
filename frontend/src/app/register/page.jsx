import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import EmailInput from "@/components/ui/email-input.component";
import PasswordInput from "@/components/ui/password-input.component";
import UsernameInput from "@/components/ui/username-input.component";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <Section className="flex md:flex-row-reverse flex-col pt-24">
      <div className="min-h-[400px] md:min-h-full w-full md:w-1/2 md:block hidden relative md:self-auto self-stretch">
        <Image
          src="/dev/test.jpg"
          alt="Placeholder"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <form className="flex flex-col w-full md:w-1/2 items-center justify-center md:py-0 py-8">
        <h1 className="mb-8 md:mb-12 font-semibold text-xl text-center">
          Create an account
        </h1>
        <fieldset className="fieldset w-full max-w-md px-4 md:px-0 space-y-3">
          <div className="column-gap">
            <legend className="legend">Username</legend>
            <UsernameInput />
          </div>
          <div className="column-gap">
            <legend className="legend">Email</legend>
            <EmailInput />
          </div>
          <div className="column-gap">
            <legend className="legend">Password</legend>
            <PasswordInput />
          </div>
          <div className="column-gap">
            <legend className="legend">Confirm Password</legend>
            <PasswordInput />
          </div>
          <Button type="submit">Register</Button>
          <Link className="link block text-center" href={"/login"}>
            Already have an account?
          </Link>
        </fieldset>
      </form>
    </Section>
  );
}
