import { IconUser } from "@tabler/icons-react";

export default function UsernameInput(props) {
  return (
    <>
      <label className="input validator w-full">
        <IconUser className="opacity-50" size={20} />
        <input
          type="text"
          required
          placeholder="Username"
          pattern="[A-Za-z][A-Za-z0-9\-]*"
          minLength="3"
          maxLength="30"
          title="Only letters, numbers or dash"
          {...props}
        />
      </label>
      <p className="validator-hint mt-0 hidden">
        Must be 3 to 30 characters
        <br />
        containing only letters, numbers or dash
      </p>
    </>
  );
}
