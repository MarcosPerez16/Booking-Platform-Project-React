import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '@/components/ThemeProvider';
import {
  Button,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@/components/ui';
import { env } from '@/lib/env';
import { getImageUrl } from '@/lib/utils/images';
import { getItem, setItem } from '@/lib/utils/localStorage';

import DevbarMenu from './DevbarMenu';
import {
  Completed as M0Completed,
  Intro as M0Intro,
  Step1 as M0Step1,
  Step2 as M0Step2,
  Step3 as M0Step3,
  Step4 as M0Step4,
} from './Module0';
import {
  Completed as M1Completed,
  Intro as M1Intro,
  Step1 as M1Step1,
  Step2 as M1Step2,
  Step3 as M1Step3,
  Step4 as M1Step4,
  Step5 as M1Step5,
  Step6 as M1Step6,
} from './Module1';

// Declares the initial module to start on
const INITIAL_MODULE = '0-introduction';

// Creates an object with all the modules and their steps
const modules = {
  '0-introduction': {
    steps: {
      0: <M0Intro />,
      1: <M0Step1 />,
      2: <M0Step2 />,
      3: <M0Step3 />,
      4: <M0Step4 />,
      5: <M0Completed />,
    },
  },
  '1-react-fundamentals': {
    steps: {
      0: <M1Intro />,
      1: <M1Step1 />,
      2: <M1Step2 />,
      3: <M1Step3 />,
      4: <M1Step4 />,
      5: <M1Step5 />,
      6: <M1Step6 />,
      7: <M1Completed />,
    },
  },
  '2-state-and-event-handlers': {},
  '3-effects-and-data-fetching': {},
  '4-routes-and-navigation': {},
  '5-hooks-and-performance': {},
  '6-state-management': {},
  '7-forms-and-authentication': {},
  '8-deploying': {},
};

// Creates an object with the initial progress for each module
const initialModuleProgress = Object.keys(modules).reduce((acc, moduleKey) => {
  acc[moduleKey] = 0;
  return acc;
}, {});

const Devbar = () => {
  const { theme } = useTheme();

  // Creates state for the current module and defaults to localStorage if it exists
  const [currentModule, setCurrentModule] = useState(
    getItem('project-react-module') || INITIAL_MODULE,
  );

  // Creates state for the current module progress and defaults to localStorage if it exists
  const [moduleProgress, setModuleProgress] = useState(
    getItem('project-react-moduleProgress') || initialModuleProgress,
  );

  // On mount, sets the initial module and module progress in localStorage if it doesn't exist
  useEffect(() => {
    if (!getItem('project-react-module')) {
      setItem('project-react-module', INITIAL_MODULE);
    }

    if (!getItem('project-react-moduleProgress')) {
      setItem('project-react-moduleProgress', initialModuleProgress);
    }
  }, []);

  // Derived value for the current module step
  const moduleStep = moduleProgress[currentModule];

  // Derived value for the current module steps length
  const moduleStepsLength = useMemo(
    () => Object.keys(modules[currentModule].steps).length,
    [currentModule],
  );

  // Derived value for the current module progress percentage
  const progressPercentage = (moduleStep / (moduleStepsLength - 1)) * 100;

  // Handles the module change
  const handleModuleChange = (moduleKey) => {
    setCurrentModule(moduleKey);
    setItem('project-react-module', moduleKey);
  };

  // Handles the previous step click
  const handlePreviousStep = () => {
    if (moduleStep > 0) {
      const newModuleProgress = {
        ...moduleProgress,
        [currentModule]: moduleStep - 1,
      };

      setModuleProgress(newModuleProgress);
      setItem('project-react-moduleProgress', newModuleProgress);
    }
  };

  // Handles the next step click
  const handleCompleteStep = () => {
    if (moduleStep < moduleStepsLength) {
      const newModuleProgress = {
        ...moduleProgress,
        [currentModule]: moduleStep + 1,
      };

      setModuleProgress(newModuleProgress);
      setItem('project-react-moduleProgress', newModuleProgress);
    }
  };

  return (
    <div className='relative h-screen w-[700px] flex-col items-center overflow-auto bg-card'>
      <div className='flex flex-row items-center justify-between gap-4 p-4'>
        <div className='flex flex-row items-center gap-3'>
          <img
            src={getImageUrl(
              theme === 'dark' ? '100w-logo.png' : '100w-logo-black.png',
            )}
            alt='logo'
            className='h-[36px]'
          />
          <a
            className='text-lg leading-5'
            href={env.COSDEN_SOLUTIONS_URL + '/project-react'}
            target='_blank'
            rel='noreferrer'
          >
            <b>Project React (Preview)</b>
            <br />
            <span className='text-sm text-muted-foreground'>
              Made by <b>Cosden</b> Solutions
            </span>
          </a>
        </div>
        <div className='flex flex-row items-center gap-4'>
          <Button
            disabled={moduleStep === 0}
            variant='secondary'
            onClick={handlePreviousStep}
          >
            Previous
          </Button>
          <Button
            disabled={moduleStep === moduleStepsLength - 1}
            onClick={handleCompleteStep}
          >
            Next
          </Button>
          <DevbarMenu />
        </div>
      </div>

      <Separator />

      <div className='p-4'>
        <Progress value={progressPercentage} />
      </div>

      <Separator />

      <div className='p-4 pb-0'>
        <Select defaultValue={currentModule} onValueChange={handleModuleChange}>
          <SelectTrigger className='mb-2 w-full'>
            <SelectValue placeholder='Select a module' />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(modules).map((moduleKey) => {
              const moduleSteps =
                (modules[moduleKey].steps &&
                  Object.keys(modules[moduleKey].steps).length) ||
                null;

              return (
                <SelectItem
                  key={moduleKey}
                  value={moduleKey}
                  disabled={!modules[moduleKey].steps}
                >
                  {moduleKey}
                  {moduleSteps && (
                    <span className='ml-2 text-sm text-muted-foreground'>
                      {moduleProgress[moduleKey] + 1 === moduleSteps
                        ? 'Completed'
                        : `(${
                            moduleProgress[moduleKey] + 1
                          } of ${moduleSteps} tasks)`}
                    </span>
                  )}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className='p-4'>{modules[currentModule].steps[moduleStep]}</div>
    </div>
  );
};

export default Devbar;
