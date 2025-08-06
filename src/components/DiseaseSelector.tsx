import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, Activity, Droplets, FileText, Stethoscope, Brain, Shield } from 'lucide-react';

interface DiseaseSelectorProps {
  onSelectDisease: (disease: string) => void;
  onOtherSelected: () => void;
}

export const DiseaseSelector = ({ onSelectDisease, onOtherSelected }: DiseaseSelectorProps) => {
  const [selectedDisease, setSelectedDisease] = useState<string>('');

  const diseases = [
    {
      id: 'heart',
      name: 'Heart Disease',
      icon: Heart,
      description: 'Cardiovascular risk assessment and heart health analysis',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'hypertension',
      name: 'Hypertension',
      icon: Activity,
      description: 'Blood pressure monitoring and management insights',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'diabetes',
      name: 'Diabetes',
      icon: Droplets,
      description: 'Blood sugar evaluation and diabetes risk analysis',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'other',
      name: 'Other Conditions',
      icon: FileText,
      description: 'Upload medical reports for comprehensive analysis',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const handleSubmit = () => {
    if (selectedDisease === 'other') {
      onOtherSelected();
    } else if (selectedDisease) {
      onSelectDisease(selectedDisease);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Card className="modern-card p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-primary mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-glow animate-pulse-glow">
            <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            Select Health Assessment Category
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose the health category that best matches your medical reports or concerns. 
            Our AI will provide specialized analysis based on your selection.
          </p>
        </div>

        {/* Disease Selection */}
        <RadioGroup value={selectedDisease} onValueChange={setSelectedDisease} className="space-y-4 sm:space-y-6">
          {diseases.map((disease, index) => (
            <div key={disease.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <Label htmlFor={disease.id} className="cursor-pointer">
                <Card className={`floating-card p-4 sm:p-6 transition-all duration-300 ${
                  selectedDisease === disease.id
                    ? 'ring-2 ring-primary shadow-glow bg-gradient-to-r from-primary/5 to-primary/10'
                    : 'hover:shadow-float'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <RadioGroupItem value={disease.id} id={disease.id} className="scale-125 order-1 sm:order-none" />
                    
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${disease.color} flex items-center justify-center shadow-card order-first sm:order-none`}>
                      <disease.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                        {disease.name}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {disease.description}
                      </p>
                    </div>

                    {selectedDisease === disease.id && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in order-2 sm:order-none">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </Card>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Security Notice */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-1 sm:mb-2 text-sm sm:text-base">Privacy & Security</h4>
              <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                Your health data is encrypted and processed securely. We never store your personal 
                medical information and all analyses are performed with complete confidentiality.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <Button
            onClick={handleSubmit}
            disabled={!selectedDisease}
            className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-primary hover:opacity-90 transition-spring text-base sm:text-lg font-medium rounded-lg sm:rounded-xl shadow-glow disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {selectedDisease === 'other' ? 'Upload Medical Reports' : 'Start Health Assessment'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
