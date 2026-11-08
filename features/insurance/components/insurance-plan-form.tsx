'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { insurancePlanSchema, type InsurancePlanFormData, type InsurancePlan } from '../types';
import { createInsurancePlan, updateInsurancePlan } from '../services/actions';
import { PLAN_TYPES } from '@/constants';

interface InsurancePlanFormProps {
  plan?: InsurancePlan;
}

export function InsurancePlanForm({ plan }: InsurancePlanFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!plan;

  const currentYear = new Date().getFullYear();

  const form = useForm<InsurancePlanFormData>({
    resolver: zodResolver(insurancePlanSchema),
    defaultValues: {
      plan_name: plan?.plan_name || '',
      plan_type: plan?.plan_type as InsurancePlanFormData['plan_type'] || undefined,
      plan_year: plan?.plan_year || currentYear,
      individual_deductible: plan?.individual_deductible || 0,
      family_deductible: plan?.family_deductible || 0,
      individual_oop_max: plan?.individual_oop_max || 0,
      family_oop_max: plan?.family_oop_max || 0,
      hsa_eligible: plan?.hsa_eligible ?? false,
      fsa_eligible: plan?.fsa_eligible ?? false,
      is_active: plan?.is_active ?? true,
    },
  });

  async function onSubmit(data: InsurancePlanFormData) {
    setError(null);
    setIsLoading(true);

    try {
      const result = isEditing
        ? await updateInsurancePlan(plan.id, data)
        : await createInsurancePlan(data);

      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Info */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium">Plan Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="plan_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Blue Cross PPO 2024"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PLAN_TYPES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="plan_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Year *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="2000"
                        max="2100"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || currentYear)}
                      />
                    </FormControl>
                    <FormDescription>
                      The calendar year this plan is effective
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0 mt-8">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Active Plan</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Deductibles */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium">Deductibles</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="individual_deductible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Individual Deductible *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="family_deductible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family Deductible *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Out-of-Pocket Max */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium">Out-of-Pocket Maximum</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="individual_oop_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Individual OOP Max *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="family_oop_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family OOP Max *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-7"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* HSA/FSA Eligibility */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium">Tax-Advantaged Account Eligibility</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="hsa_eligible"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0 rounded-lg border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="font-normal">HSA Eligible</FormLabel>
                      <FormDescription>
                        This is a high-deductible health plan (HDHP)
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fsa_eligible"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0 rounded-lg border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="font-normal">FSA Eligible</FormLabel>
                      <FormDescription>
                        Can use Flexible Spending Account funds
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Saving...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create Plan'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
