"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Grid,
	TextField,
	Typography,
	MenuItem,
	Alert,
	CircularProgress,
	InputAdornment,
	Stepper,
	Step,
	StepLabel,
	Chip,
} from "@mui/material";
import { CloudUpload, Lock, Schedule } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { z } from "zod";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import {
	Status,
	SubmitterType,
	useCreateFinance,
	UsersCategory
} from "@/lib/api/finance";
import { useFlagState } from "@/lib/api/flag/hook";

// Custom styled component for visually hiding the file input
const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

// ----- 1) Zod Schema with Preprocessing -----
const reimbursementSchema = z.object({
	amount: z.preprocess(
		(val) => {
			if (typeof val === "string" && val.trim() === "") return undefined;
			return Number(val);
		},
		z
			.number({
				required_error: "Amount is required",
				invalid_type_error: "Amount must be a number",
			})
			.min(0.01, "Amount must be greater than 0")
	),
	description: z
		.string({
			required_error: "Description is required",
		})
		.min(5, "Description must be at least 5 characters"),
	category: z.nativeEnum(UsersCategory, {
		required_error: "Category is required",
	}),
	street: z
		.string({
			required_error: "Street address is required",
		})
		.min(1, "Street address is required"),
	city: z
		.string({
			required_error: "City is required",
		})
		.min(1, "City is required"),
	state: z
		.string({
			required_error: "State is required",
		})
		.length(2, "Please use 2-letter state code"),
	postalCode: z
		.string({
			required_error: "ZIP code is required",
		})
		.regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
	receipt: z
		.any()
		.refine((file) => file instanceof File, "Receipt is required"),
});

type ReimbursementFormData = z.infer<typeof reimbursementSchema>;

// ----- 2) Step Components -----
const BasicInfoStep = ({
	control,
	errors,
	categories,
}: {
	control: any;
	errors: any;
	categories: UsersCategory[];
}) => (
	<Grid container spacing={4} className="mb-6">
		<Grid item xs={12} md={6}>
			<Controller
				name="amount"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Amount"
						type="number"
						fullWidth
						error={!!errors.amount}
						helperText={errors.amount?.message}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">$</InputAdornment>
							),
						}}
						onChange={(e) => field.onChange(e.target.value)}
						className="shadow-sm"
					/>
				)}
			/>
		</Grid>
		<Grid item xs={12} md={6}>
			<Controller
				name="category"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						select
						label="Category"
						fullWidth
						error={!!errors.category}
						helperText={errors.category?.message}
						className="shadow-sm"
					>
						{categories.map((option) => (
							<MenuItem key={option} value={option}>
								{option}
							</MenuItem>
						))}
					</TextField>
				)}
			/>
		</Grid>
		<Grid item xs={12}>
			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Description"
						multiline
						rows={4}
						fullWidth
						error={!!errors.description}
						helperText={errors.description?.message}
						className="shadow-sm"
					/>
				)}
			/>
		</Grid>
	</Grid>
);

const AddressStep = ({ control, errors }: { control: any; errors: any }) => (
	<Grid container spacing={4} className="mb-6">
		<Grid item xs={12}>
			<Controller
				name="street"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="Street Address"
						fullWidth
						error={!!errors.street}
						helperText={errors.street?.message}
						className="shadow-sm"
					/>
				)}
			/>
		</Grid>
		<Grid item xs={12} md={6}>
			<Controller
				name="city"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="City"
						fullWidth
						error={!!errors.city}
						helperText={errors.city?.message}
						className="shadow-sm"
					/>
				)}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<Controller
				name="state"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="State"
						fullWidth
						error={!!errors.state}
						helperText={errors.state?.message}
						className="shadow-sm"
					/>
				)}
			/>
		</Grid>
		<Grid item xs={12} md={3}>
			<Controller
				name="postalCode"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label="ZIP Code"
						fullWidth
						error={!!errors.postalCode}
						helperText={errors.postalCode?.message}
						className="shadow-sm"
					/>
				)}
			/>
		</Grid>
	</Grid>
);

const ReceiptStep = ({ control, errors }: { control: any; errors: any }) => (
	<Controller
		name="receipt"
		control={control}
		render={({ field }) => (
			<Box className="text-center py-6">
				<Button
					component="label"
					variant="contained"
					startIcon={<CloudUpload />}
					className="bg-blue-600 hover:bg-blue-700"
				>
					Upload Receipt
					<VisuallyHiddenInput
						type="file"
						accept=".pdf"
						onChange={(e) => {
							const file = e.target.files?.[0] || null;
							field.onChange(file);
						}}
					/>
				</Button>
				{field.value && (
					<Typography variant="body2" color="text.secondary" className="mt-2">
						Selected file: {field.value.name}
					</Typography>
				)}
				{errors.receipt && (
					<Typography variant="body2" color="error" className="mt-2">
						{errors.receipt.message as string}
					</Typography>
				)}
			</Box>
		)}
	/>
);

const NavigationButtons = ({
	activeStep,
	steps,
	handleNext,
	handleBack,
	isSubmitting,
	isValid,
}: {
	activeStep: number;
	steps: string[];
	handleNext: () => void;
	handleBack: () => void;
	isSubmitting: boolean;
	isValid: boolean;
}) => (
	<Box className="flex justify-between mt-6">
		<Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
			Back
		</Button>
		<Box className="flex gap-4 ">
			{activeStep < steps.length - 1 && (
				<Button
					variant="contained"
					onClick={handleNext}
					type="button"
					className="bg-blue-600 hover:bg-blue-700"
				>
					Next
				</Button>
			)}
			{activeStep === steps.length - 1 && (
				<Button
					variant="contained"
					type="submit"
					disabled={isSubmitting || !isValid}
					color="primary"
					className="bg-blue-600 hover:bg-blue-700"
				>
					{isSubmitting ? (
						<>
							<CircularProgress size={20} className="mr-2" />
							Submitting...
						</>
					) : (
						"Submit Request"
					)}
				</Button>
			)}
		</Box>
	</Box>
);

// ----- 3) Main ReimbursementPage Component -----
const steps = ["Basic Information", "Address Details", "Receipt Upload"];
const categories = Object.values(UsersCategory
);

export default function ReimbursementPage() {
	const [activeStep, setActiveStep] = useState(0);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const { user } = useFirebase();
	const createFinance = useCreateFinance();

	// Feature flag check
	const { data: participantReimbursementFlag, isLoading: flagLoading } =
		useFlagState("ParticipantReimbursement");

	const {
		handleSubmit,
		control,
		formState: { errors, isValid },
		reset,
	} = useForm<ReimbursementFormData>({
		resolver: async (data) => {
			try {
				const validatedData = await reimbursementSchema.parseAsync(data);
				return { values: validatedData, errors: {} };
			} catch (error) {
				if (error instanceof z.ZodError) {
					const formattedErrors: Record<string, { message: string }> = {};
					error.errors.forEach((err) => {
						if (err.path && err.path.length > 0) {
							formattedErrors[err.path[0]] = { message: err.message };
						}
					});
					return { values: {}, errors: formattedErrors };
				}
				return { values: {}, errors: { _: { message: "Validation failed" } } };
			}
		},
		defaultValues: {
			amount: 0,
			category: UsersCategory.TravelTransportation,
			description: "",
			street: "",
			city: "",
			state: "",
			postalCode: "",
			receipt: undefined,
		},
		mode: "onChange",
	});

	const onSubmit = async (data: ReimbursementFormData) => {
		if (!user?.uid) {
			setSubmitError("User must be logged in to submit reimbursement");
			return;
		}

		try {
			setIsSubmitting(true);
			setSubmitError(null);

			// Build FormData for file upload and other fields
			const formData = new FormData();
			formData.append("receipt", data.receipt);
			Object.entries(data).forEach(([key, value]) => {
				if (key !== "receipt") {
					formData.append(key, String(value));
				}
			});
			formData.append("submitterType", SubmitterType.USER);
			formData.append("submitterId", user.uid);
			formData.append("status", Status.PENDING);

			await createFinance.mutateAsync(formData);
			setSubmitSuccess(true);
			reset();
			setActiveStep(0);
		} catch (error) {
			console.error("Submission error:", error);
			setSubmitError(
				error instanceof Error
					? error.message
					: "Failed to submit reimbursement. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleNext = () => setActiveStep((prev) => prev + 1);
	const handleBack = () => setActiveStep((prev) => prev - 1);

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (
					<BasicInfoStep
						control={control}
						errors={errors}
						categories={categories}
					/>
				);
			case 1:
				return <AddressStep control={control} errors={errors} />;
			case 2:
				return <ReceiptStep control={control} errors={errors} />;
			default:
				return null;
		}
	};

	// Show loading state while flag is being fetched
	if (flagLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-transparent">
				<Container maxWidth="md">
					<Card className="bg-white shadow-lg rounded-lg overflow-hidden">
						<CardContent className="p-8 text-center">
							<CircularProgress className="mb-4" />
							<Typography variant="h6" color="text.secondary">
								Loading...
							</Typography>
						</CardContent>
					</Card>
				</Container>
			</div>
		);
	}

	const isReimbursementEnabled =
		participantReimbursementFlag?.isEnabled ?? false;

	return (
		<div className="min-h-screen flex items-center justify-center bg-transparent">
			<Container maxWidth="md">
				<Card className="bg-white shadow-lg rounded-lg overflow-hidden">
					<CardContent className="p-8">
						{/* Feature Flag Status Banner */}
						{isReimbursementEnabled ? (
							// Show the normal form when flag is enabled
							<>
								<Typography
									variant="h4"
									gutterBottom
									align="center"
									className="mb-6"
								>
									Submit Reimbursement Request
								</Typography>

								<Stepper activeStep={activeStep} className="mb-8">
									{steps.map((label) => (
										<Step key={label}>
											<StepLabel>{label}</StepLabel>
										</Step>
									))}
								</Stepper>

								{submitError && (
									<Alert severity="error" className="mb-4">
										{submitError}
									</Alert>
								)}

								{submitSuccess && (
									<Alert severity="success" className="mb-4">
										Reimbursement request submitted successfully!
									</Alert>
								)}

								<form onSubmit={handleSubmit(onSubmit)}>
									{renderStepContent(activeStep)}
									<NavigationButtons
										activeStep={activeStep}
										steps={steps}
										handleNext={handleNext}
										handleBack={handleBack}
										isSubmitting={isSubmitting}
										isValid={isValid}
									/>
								</form>
							</>
						) : (
							<>
								<Box className="mb-6">
									<Box className="flex items-center justify-between mb-2">
										<Typography variant="h6" className="text-gray-700">
											Reimbursement System
										</Typography>
										<Chip
											label={isReimbursementEnabled ? "ENABLED" : "DISABLED"}
											color={isReimbursementEnabled ? "success" : "default"}
											size="small"
											icon={isReimbursementEnabled ? undefined : <Lock />}
										/>
									</Box>
									<Alert
										severity={isReimbursementEnabled ? "success" : "info"}
										icon={isReimbursementEnabled ? undefined : <Schedule />}
									>
										{isReimbursementEnabled
											? "Participant reimbursement submissions are currently open."
											: "Participant reimbursement submissions are currently closed. We will open reimbursements on the day of the hackathon."}
									</Alert>
								</Box>
								<Box className="text-center py-12">
									<Lock
										className="text-gray-400 mb-4"
										style={{ fontSize: 64 }}
									/>

									<Typography
										variant="h6"
										color="text.secondary"
										className="mb-4"
									>
										Participant reimbursement submissions are not yet open.
									</Typography>
								</Box>
							</>
						)}
					</CardContent>
				</Card>
			</Container>
		</div>
	);
}
