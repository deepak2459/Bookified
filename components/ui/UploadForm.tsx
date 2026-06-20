'use client';

import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ImageIcon, X, Loader2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

import { UploadSchema } from '@/lib/zod';
import { voiceOptions, voiceCategories, DEFAULT_VOICE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type {
    BookUploadFormValues,
    FileUploadFieldProps,
    InputFieldProps,
    VoiceSelectorProps,
} from '@/type';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// ─── Loading Overlay ─────────────────────────────────────────────────────────

function LoadingOverlay() {
    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper bg-white shadow-2xl">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation w-14 h-14 text-[#663820]" />
                    <p className="loading-title">Processing your book…</p>
                    <div className="loading-progress">
                        <div className="loading-progress-item">
                            <span className="loading-progress-status" />
                            <span className="text-[var(--text-secondary)]">Uploading files</span>
                        </div>
                        <div className="loading-progress-item">
                            <span className="loading-progress-status" />
                            <span className="text-[var(--text-secondary)]">Analysing content</span>
                        </div>
                        <div className="loading-progress-item">
                            <span className="loading-progress-status" />
                            <span className="text-[var(--text-secondary)]">Preparing voice assistant</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── File Upload Field ────────────────────────────────────────────────────────

function FileUploadField<T extends FieldValues>({
    control,
    name,
    label,
    icon: Icon,
    placeholder,
    hint,
    acceptTypes,
    disabled,
}: FileUploadFieldProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { value, onChange } }) => {
                const file = value as File | undefined;

                const handleClick = () => {
                    if (!disabled) inputRef.current?.click();
                };

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const selected = e.target.files?.[0];
                    if (selected) onChange(selected);
                };

                const handleRemove = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    onChange(undefined);
                    if (inputRef.current) inputRef.current.value = '';
                };

                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <div
                            className={cn(
                                'upload-dropzone border-2 border-dashed border-[var(--border-subtle)]',
                                file && 'upload-dropzone-uploaded !border-[var(--accent-warm)]',
                                disabled && 'opacity-60 cursor-not-allowed',
                            )}
                            onClick={handleClick}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept={acceptTypes.join(',')}
                                className="hidden"
                                onChange={handleChange}
                                disabled={disabled}
                            />
                            <Icon className="upload-dropzone-icon" />
                            <p className="upload-dropzone-text">
                                {file ? file.name : placeholder}
                            </p>
                            {file ? (
                                <button
                                    type="button"
                                    className="upload-dropzone-remove mt-1"
                                    onClick={handleRemove}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            ) : (
                                <p className="upload-dropzone-hint">{hint}</p>
                            )}
                        </div>
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function InputField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    disabled,
}: InputFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <input
                        {...field}
                        id={`${String(name)}-input`}
                        className={cn(
                            'form-input border border-[var(--border-subtle)]',
                            disabled && 'opacity-60 cursor-not-allowed',
                        )}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

// ─── Voice Selector ───────────────────────────────────────────────────────────

function VoiceSelector({ value, onChange, disabled, className }: VoiceSelectorProps) {
    const groups = [
        { label: 'Male Voices', keys: voiceCategories.male },
        { label: 'Female Voices', keys: voiceCategories.female },
    ] as const;

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {groups.map(({ label, keys }) => (
                <div key={label} className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                        {label}
                    </p>
                    <div className="voice-selector-options">
                        {keys.map(key => {
                            const voice = voiceOptions[key as keyof typeof voiceOptions];
                            const selected = value === voice.id;
                            return (
                                <div
                                    key={key}
                                    className={cn(
                                        'voice-selector-option',
                                        selected
                                            ? 'voice-selector-option-selected'
                                            : 'voice-selector-option-default',
                                        disabled && 'voice-selector-option-disabled',
                                    )}
                                    onClick={() => !disabled && onChange(voice.id)}
                                >
                                    <div className="text-center">
                                        <p className="font-semibold text-[#212a3b] text-base leading-tight">
                                            {voice.name}
                                        </p>
                                        <p className="text-xs text-[#777] mt-0.5 leading-snug">
                                            {voice.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Upload Form ──────────────────────────────────────────────────────────────

const UploadForm = () => {
    const form = useForm<BookUploadFormValues>({
        resolver: zodResolver(UploadSchema),
        defaultValues: {
            pdf: undefined,
            coverImage: undefined,
            title: '',
            author: '',
            voice: voiceOptions[DEFAULT_VOICE as keyof typeof voiceOptions].id,
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: BookUploadFormValues) => {
        // TODO: implement upload action
        console.log(values);
    };

    return (
        <div className="new-book-wrapper">
            {isSubmitting && <LoadingOverlay />}

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* PDF Upload */}
                    <FileUploadField
                        control={control}
                        name="pdf"
                        label="PDF File"
                        icon={Upload}
                        placeholder="Click to upload PDF"
                        hint="PDF file (max 50MB)"
                        acceptTypes={['application/pdf']}
                        disabled={isSubmitting}
                    />

                    {/* Cover Image Upload */}
                    <FileUploadField
                        control={control}
                        name="coverImage"
                        label="Cover Image"
                        icon={ImageIcon}
                        placeholder="Click to upload cover image"
                        hint="Leave empty to auto-generate from PDF"
                        acceptTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                        disabled={isSubmitting}
                    />

                    {/* Title */}
                    <InputField
                        control={control}
                        name="title"
                        label="Title"
                        placeholder="ex: Rich Dad Poor Dad"
                        disabled={isSubmitting}
                    />

                    {/* Author */}
                    <InputField
                        control={control}
                        name="author"
                        label="Author Name"
                        placeholder="ex: Robert Kiyosaki"
                        disabled={isSubmitting}
                    />

                    {/* Voice Selector */}
                    <div className="flex flex-col">
                        <label className="form-label">Choose Assistant Voice</label>
                        <Controller
                            control={control}
                            name="voice"
                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                <>
                                    <VoiceSelector
                                        value={value}
                                        onChange={onChange}
                                        disabled={isSubmitting}
                                    />
                                    {error && (
                                        <p className="mt-1.5 text-sm font-medium text-red-500">
                                            {error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="form-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing…' : 'Begin Synthesis'}
                    </button>
                </form>
            </Form>
        </div>
    );
};

export default UploadForm;
