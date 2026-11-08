'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

import { expenseSchema, type ExpenseFormData, type Expense } from '../types';
import { createExpense, updateExpense } from '../services/actions';
import { EXPENSE_CATEGORIES } from '@/constants';

interface ExpenseFormProps {
  expense?: Expense;
  familyMembers?: Array<{ id: string; name: string }>;
  insurancePlans?: Array<{ id: string; plan_name: string }>;
}

export function ExpenseForm({
  expense,
  familyMembers = [],
  insurancePlans = [],
}: ExpenseFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!expense;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: expense?.date || new Date().toISOString().split('T')[0],
      provider_name: expense?.provider_name || '',
      description: expense?.description || '',
      category: expense?.category as ExpenseFormData['category'] || undefined,
      billed_amount: expense?.billed_amount || 0,
      insurance_paid: expense?.insurance_paid || 0,
      you_paid: expense?.you_paid || 0,
      hsa_fsa_eligible: expense?.hsa_fsa_eligible ?? true,
      paid_with_hsa_fsa: expense?.paid_with_hsa_fsa ?? false,
      reimbursed: expense?.reimbursed ?? false,
      reimbursement_date: expense?.reimbursement_date || null,
      counts_toward_deductible: expense?.counts_toward_deductible ?? true,
      counts_toward_oop_max: expense?.counts_toward_oop_max ?? true,
      notes: expense?.notes || '',
      family_member_id: expense?.family_member_id || null,
      insurance_plan_id: expense?.insurance_plan_id || null,
    },
  });

  // Auto-calculate you_paid when billed_amount or insurance_paid changes
  const billedAmount = form.watch('billed_amount');
  const insurancePaid = form.watch('insurance_paid');

  async function onSubmit(data: ExpenseFormData) {
    setError(null);
    setIsLoading(true);

    try {
      const result = isEditing
        ? await updateExpense(expense.id, data)
        : await createExpense(data);

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
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input type="date" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="provider_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., City Hospital, CVS Pharmacy"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Annual checkup, Prescription refill"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Amounts */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium">Amounts</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="billed_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billed Amount *</FormLabel>
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
                    <FormDescription>Total amount billed</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="insurance_paid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Paid</FormLabel>
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
                    <FormDescription>Amount covered by insurance</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="you_paid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>You Paid *</FormLabel>
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
                    <FormDescription>Your out-of-pocket amount</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {billedAmount > 0 && insurancePaid > 0 && (
              <p className="text-sm text-muted-foreground">
                Expected out-of-pocket: ${(billedAmount - insurancePaid).toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* HSA/FSA & Tracking */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-medium">HSA/FSA & Tracking</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="hsa_fsa_eligible"
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
                      <FormLabel className="font-normal">HSA/FSA Eligible</FormLabel>
                      <FormDescription>
                        This expense qualifies for HSA/FSA
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paid_with_hsa_fsa"
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
                      <FormLabel className="font-normal">Paid with HSA/FSA</FormLabel>
                      <FormDescription>
                        Used HSA/FSA funds for this expense
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="counts_toward_deductible"
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
                      <FormLabel className="font-normal">
                        Counts Toward Deductible
                      </FormLabel>
                      <FormDescription>
                        Include in deductible calculation
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="counts_toward_oop_max"
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
                      <FormLabel className="font-normal">
                        Counts Toward OOP Max
                      </FormLabel>
                      <FormDescription>
                        Include in out-of-pocket max
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="reimbursed"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Reimbursed</FormLabel>
                  </FormItem>
                )}
              />

              {form.watch('reimbursed') && (
                <FormField
                  control={form.control}
                  name="reimbursement_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reimbursement Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          disabled={isLoading}
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optional: Family Member & Insurance Plan */}
        {(familyMembers.length > 0 || insurancePlans.length > 0) && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-medium">Additional Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {familyMembers.length > 0 && (
                  <FormField
                    control={form.control}
                    name="family_member_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Family Member</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || undefined}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select family member" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {familyMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {insurancePlans.length > 0 && (
                  <FormField
                    control={form.control}
                    name="insurance_plan_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Plan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || undefined}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select insurance plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {insurancePlans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.plan_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this expense..."
                      rows={3}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              'Create Expense'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
