"use client";
import * as Form from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Label from "@radix-ui/react-label";

const Register = () => {
	return (
		<main className="bg-black w-full flex flex-col items-center gap-6 p-10">
			<h1 className="text-white font-bold text-4xl">
				Register for our Hackathon!
			</h1>
			<Form.Root className="bg-black w-6/12 flex flex-col gap-6">
				<Form.Field className="grid mb-[10px]" name="name">
					<div className="flex items-baseline justify-between">
						<Form.Label className="text-lg font-medium leading-[35px] text-white">
							What is your name?
						</Form.Label>
					</div>
					<Form.Control asChild>
						<input
							className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9"
							type="name"
							required
						/>
					</Form.Control>
				</Form.Field>
				<Form.Field className="grid mb-[10px]" name="name">
					<div className="flex items-baseline justify-between">
						<Form.Label className="text-lg font-medium leading-[35px] text-white">
							Which gender do you identify with?
						</Form.Label>
					</div>
					<Form.Control asChild>
						<RadioGroup.Root
							className="flex flex-col gap-2.5"
							defaultValue=""
							aria-label="View density"
						>
							<div className="flex items-center">
								<RadioGroup.Item
									className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
									value="male"
									id="r1"
								>
									<RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-black" />
								</RadioGroup.Item>
								<Label.Root
									className="text-md font-medium leading-none p-2 text-white"
									htmlFor="r1"
								>
									Male
								</Label.Root>
							</div>
							<div className="flex items-center">
								<RadioGroup.Item
									className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
									value="female"
									id="r2"
								>
									<RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-black" />
								</RadioGroup.Item>
								<Label.Root
									className="text-md font-medium leading-none p-2 text-white"
									htmlFor="r2"
								>
									Female
								</Label.Root>
							</div>
							<div className="flex items-center">
								<RadioGroup.Item
									className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
									value="non-binary"
									id="r3"
								>
									<RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-black" />
								</RadioGroup.Item>
								<Label.Root
									className="text-md font-medium leading-none p-2 text-white"
									htmlFor="r3"
								>
									Non-Binary
								</Label.Root>
							</div>
							<div className="flex items-center">
								<RadioGroup.Item
									className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
									value="prefer-not-to-disclose"
									id="r4"
								>
									<RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-black" />
								</RadioGroup.Item>
								<Label.Root
									className="text-md font-medium leading-none p-2 text-white"
									htmlFor="r4"
								>
									Prefer not to disclose
								</Label.Root>
							</div>
						</RadioGroup.Root>
					</Form.Control>
				</Form.Field>
				<Form.Submit asChild>
					<button className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
						Register!
					</button>
				</Form.Submit>
				<Form.Field className="grid mb-[10px]" name="name">
					<div className="flex items-baseline justify-between">
						<Form.Label className="text-lg font-medium leading-[35px] text-white">
							What is your phone number?
						</Form.Label>
					</div>
					<Form.Control asChild>
						<input
							className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9"
							type="name"
							required
						/>
					</Form.Control>
				</Form.Field>
			</Form.Root>
		</main>
	);
};

export default Register;
