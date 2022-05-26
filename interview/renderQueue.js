import React, { FC, forwardRef, useCallback, useEffect, useState } from 'react';

const createRenderQueue = () => {
  const queue = [];

  const RenderQueueHOC = WrapperComponent => {
    const RenderWrapper: FC<any> = (props) => {
      const { nextRender, ...otherProps } = props;

      useEffect(() => {
        nextRender();
      }, []);

      return <WrapperComponent {...otherProps} />
    };

    const RenderQueue: FC<any> = (props) =>  {
      const [ loading, setLoading ] = useState(false);
  
      const tryRender = useCallback(() => {
        setLoading(true);
      }, []);

      // queue.push(tryRender)
  
      const [ isFirst ] = useState(() => {
        queue.push(tryRender);
        return queue.length === 1;
      });
  
      const nextRender = useCallback(() => {
        console.log('队列数', queue.length);
        if (queue.length > 0) {
          console.log('挂载');
          const next = queue.shift();
          setTimeout(next, 2000);
          
        }
        
        // next();
      }, [queue]);
  
      useEffect(() => {
        if (isFirst) {
          nextRender();
        }
      }, []);
  
      return (
        <>
          {loading ? <RenderWrapper nextRender={nextRender} {...props} /> : '待加载'}
        </>
      );
    }

    return RenderQueue;
  };

  return RenderQueueHOC;
};

export default createRenderQueue;