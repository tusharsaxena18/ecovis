import torch
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder

def compute():
    # Load dataset without normalization
    transform = transforms.Compose([transforms.Resize((224,224)),
                                    transforms.ToTensor()])
    dataset = ImageFolder(root="D:/Documents/code/ai environment impact analyzer/dataset/training", transform=transform)
    loader = DataLoader(dataset, batch_size=100, shuffle=False, num_workers=2)

    # Compute mean and std
    mean = torch.zeros(3)
    std = torch.zeros(3)
    num_samples = 0
    count = 1

    for images, _ in loader:
        batch_samples = images.size(0)  
        images = images.view(batch_samples, 3, -1) 
        mean += images.mean(dim=[0, 2]) * batch_samples
        std += images.std(dim=[0, 2]) * batch_samples
        num_samples += batch_samples
        print(f"Image Batch: {count}")
        count = count + 1

    mean /= num_samples
    std /= num_samples

    return mean.tolist(),std.tolist()

if __name__ == "__main__":
    mean,std = compute()
    print(f"Mean: {mean}")
    print(f"Std: {std}")

# Mean: [0.6502255201339722, 0.626167893409729, 0.5942673683166504]
# Std: [0.26641741394996643, 0.263718843460083, 0.277700275182724]