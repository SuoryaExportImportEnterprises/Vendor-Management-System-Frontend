import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";

import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from "@/services/productCategoryService";

interface Category {
  _id: string;
  optionValue: string;
}


const FormFieldSettings = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState<Category[]>([]);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<Category | null>(null);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const loaded = await fetchCategories();
      setOptions(loaded);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleAddOption = async () => {
    if (!newOptionValue.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      await addCategory(newOptionValue.trim());
      toast.success("Category added successfully");
      setNewOptionValue("");
      loadOptions();
    } catch (error: unknown) {
  const err = error as { response?: { data?: { message?: string } } };
  toast.error(err?.response?.data?.message || "Failed to add category");
}
  };

  const handleStartEdit = (option: Category) => {
    setEditingId(option._id);
    setEditingValue(option.optionValue);
  };

  const handleSaveEdit = async () => {
    if (!editingValue.trim() || !editingId) return;

    try {
      await updateCategory(editingId, editingValue.trim());
      toast.success("Category updated successfully");
      setEditingId(null);
      setEditingValue("");
      loadOptions();
   } catch (error: unknown) {
  const err = error as { response?: { data?: { message?: string } } };
  toast.error(err?.response?.data?.message || "Failed to update category");
}
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleDeleteClick = (option: Category) => {
    setOptionToDelete(option);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!optionToDelete) return;

    try {
      await deleteCategory(optionToDelete._id);
      toast.success("Category deleted successfully");
      loadOptions();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeleteDialogOpen(false);
      setOptionToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">
              Product Category - Dropdown Options
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Manage the categories that appear in the Product Category dropdown.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current Options */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Current Categories</Label>

              <div className="space-y-2">
                {options.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No categories available</p>
                ) : (
                  options.map((option) => (
                    <div
                      key={option._id}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                    >
                      {editingId === option._id ? (
                        <>
                          <Input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{option.optionValue}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(option)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(option)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add New Category */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-base font-semibold">Add New Category</Label>

              <div className="flex gap-3">
                <Input
                  placeholder="Enter category name"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  className="flex-1"
                />

                <Button
                  onClick={handleAddOption}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Existing entries using old categories will not change.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "<strong>{optionToDelete?.optionValue}</strong>"?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FormFieldSettings;
