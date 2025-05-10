
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { addNote } from "@/utils/noteStorage";
import { SendIcon } from "lucide-react";

const CreateNotePage = () => {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const success = addNote({
      content: content.trim(),
      author: isAnonymous ? "" : author.trim(),
      isAnonymous,
    });
    
    if (success) {
      setTimeout(() => {
        navigate("/notes");
      }, 1000);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Share a Note</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Write Your Note</CardTitle>
          <CardDescription>
            Share something inspirational, a piece of wisdom, or a kind thought.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="note-content">Your Note</Label>
              <Textarea
                id="note-content"
                placeholder="Write something inspiring or uplifting..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="anonymous-mode" 
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous-mode" className="cursor-pointer">
                Post as a Stranger (anonymous)
              </Label>
            </div>
            
            {!isAnonymous && (
              <div className="space-y-2">
                <Label htmlFor="author-name">Your Name</Label>
                <Input
                  id="author-name"
                  placeholder="Enter your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full"
                disabled={!content.trim() || isSubmitting}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                {isSubmitting ? "Sharing..." : "Share Note"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNotePage;
